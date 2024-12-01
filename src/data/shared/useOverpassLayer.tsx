// File: useOverpassLayer.js
import L from 'leaflet';
import 'leaflet.markercluster';

export default function useOverpassLayer(
  map,
  data,
  iconMap,
  filterKey,
  isClustered = true,
) {
  const { defaultIcon } = iconMap;

  let overpassLayer;

  // Helper function: Create or get cluster group for a key
  const getClusterGroup = (clusters, clusterKey) => {
    if (!clusters[clusterKey]) {
      clusters[clusterKey] = L.markerClusterGroup({
        polygonOptions: { weight: 1.5, color: '#FFCC0D', opacity: 0.5 },
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `
            <div class="cluster-container">
              <span class="cluster-count">${count}</span>
              <span class="cluster-icon">${
                iconMap[clusterKey]?.options?.html ||
                `<small class="cluster-text">${clusterKey}</small>`
              }</span>
            </div>`,
            className: 'cluster-info',
          });
        },
      });
      overpassLayer.addLayer(clusters[clusterKey]);
    }
    return clusters[clusterKey];
  };

  // Helper function: Add marker to appropriate cluster
  const addMarkerToCluster = (clusters, lat, lon, tags) => {
    const clusterKey = tags[filterKey] || 'defaultIcon';
    const icon = iconMap[tags[filterKey]] || defaultIcon;
    const clusterGroup = getClusterGroup(clusters, clusterKey);

    const marker = L.marker([lat, lon], { icon });
    const popup = L.popup().setContent(`
      <h1>${iconMap[clusterKey]?.options?.html || 'N/A'}</h1>
      <h4>${tags?.name || 'Unnamed'}</h4>
      <p>${tags['name:en'] || ''}</p>
      <pre>${JSON.stringify(tags, null, 2)}</pre>
    `);
    marker.bindPopup(popup);
    clusterGroup.addLayer(marker);
  };

  // Helper function: Add polyline with optional marker
  const addPolylineWithMarker = (clusters, coordinates, tags) => {
    if (coordinates.length === 0) return;

    const polyline = L.polyline(coordinates, {
      color: 'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))',
      weight: 8,
    });
    overpassLayer.addLayer(polyline);

    // Add a marker at the start of the polyline for clustering
    const [lat, lon] = coordinates[0];
    addMarkerToCluster(clusters, lat, lon, tags);
  };

  if (isClustered) {
    const clusters = {};
    overpassLayer = L.layerGroup();

    // Process elements
    data.elements.forEach((element) => {
      if (element.type === 'node') {
        const { lat, lon, tags } = element;
        addMarkerToCluster(clusters, lat, lon, tags);
      } else if (element.type === 'way') {
        const { geometry, tags } = element;
        const coordinates = geometry.map((point) => [point.lat, point.lon]);
        addPolylineWithMarker(clusters, coordinates, tags);
      } else if (element.type === 'relation') {
        const { members, tags } = element;
        const wayMembers = members.filter((member) => member.type === 'way');

        wayMembers.forEach((member) => {
          if (member.geometry) {
            const coordinates = member.geometry.map((point) => [
              point.lat,
              point.lon,
            ]);
            addPolylineWithMarker(clusters, coordinates, tags);
          }
        });
      }
    });
  } else {
    // Non-clustered layer group
    overpassLayer = L.layerGroup();

    data.elements.forEach((element) => {
      if (element.type === 'node') {
        const { lat, lon, tags } = element;
        const icon = iconMap[tags[filterKey]] || defaultIcon;
        const marker = L.marker([lat, lon], { icon });
        const popup = L.popup().setContent(`
          <h1>${iconMap[filterKey]?.options?.html || 'N/A'}</h1>
          <h4>${tags?.name || 'Unnamed'}</h4>
          <p>${tags['name:en'] || ''}</p>
          <pre>${JSON.stringify(tags, null, 2)}</pre>
        `);
        marker.bindPopup(popup);
        overpassLayer.addLayer(marker);
      } else if (element.type === 'way') {
        const { geometry, tags } = element;
        const coordinates = geometry.map((point) => [point.lat, point.lon]);

        const polyline = L.polyline(coordinates, {
          color: 'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))',
          weight: 8,
        });
        overpassLayer.addLayer(polyline);

        if (coordinates.length > 0) {
          const icon = iconMap[tags[filterKey]] || defaultIcon;
          const marker = L.marker(coordinates[0], { icon });
          const popup = L.popup().setContent(`
            <h1>${iconMap[filterKey]?.options?.html || 'N/A'}</h1>
            <h4>${tags?.name || 'Unnamed'}</h4>
            <p>${tags['name:en'] || ''}</p>
            <pre>${JSON.stringify(tags, null, 2)}</pre>
          `);
          marker.bindPopup(popup);
          overpassLayer.addLayer(marker);
        }
      }
    });
  }

  // Add the layer to the map
  map.addLayer(overpassLayer);

  return {
    overpassLayer,
  };
}
