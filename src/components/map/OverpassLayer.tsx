import { useEffect } from "react";
import L from "leaflet";

export default function Overpass(map, data, iconMap, filterKey) {
  const { defaultIcon } = iconMap;

  // Create a layer group to hold the markers and polylines
  const overpassLayer = L.layerGroup();

  // Add the layer group to the map
  map.addLayer(overpassLayer);

  // Helper function to render nodes (e.g. points of interest like restaurants)
  const renderNode = (node) => {
    const { id, lat, lon, tags } = node;
    const name = tags?.name || "Unnamed";
    const icon = defaultIcon || iconMap[tags[filterKey]];
    const marker = L.marker([lat, lon], { icon });
    marker.addTo(overpassLayer);
    const popup = L.popup().setLatLng([lat, lon]).setContent(`
      <p>${tags["plant:output:electricity"]}</p>
      <h4>${name}</h4>
      <p>${tags["name:en"]}</p>
      <pre>${JSON.stringify(tags, null, 2)}</pre>
    `);
    marker.bindPopup(popup);
  };

  // Helper function to render ways (e.g. roads, areas defined by nodes)
  const renderWay = (way) => {
    const { id, geometry, tags } = way;
    const coordinates = geometry.map((point) => [point.lat, point.lon]);
    const name = tags?.name || "Unnamed Way";
    const icon = iconMap[tags[filterKey]] || defaultIcon;
    const polyline = L.polyline(coordinates, {
      color: "hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))",
      weight: 8,
    });
    polyline.addTo(overpassLayer);
    const marker = L.marker(coordinates[0], { icon });
    marker.addTo(overpassLayer);
    const popup = L.popup().setLatLng(coordinates[0]).setContent(`
      <p>${tags["plant:output:electricity"]}</p>
      <h4>${name}</h4>
      <p>${tags["name:en"]}</p>
      <pre>${JSON.stringify(tags, null, 2)}</pre>
    `);
    marker.bindPopup(popup);
  };

  // Helper function to render relations (e.g. complex structures involving multiple elements)
  const renderRelation = (relation) => {
    const { id, members, tags } = relation;
    const wayMembers = members.filter((member) => member.type === "way");

    const coordinates = wayMembers
      .map((member) => {
        if (member.geometry) {
          return member.geometry.map((point) => [point.lat, point.lon]);
        }
        return [];
      })
      .filter((coords) => coords.length > 0); // Filter out empty coordinate arrays

    if (coordinates.length === 0) return; // Don't render if no valid coordinates

    const name = tags?.name || "Unnamed Relation";

    coordinates.forEach((coords, idx) => {
      const polyline = L.polyline(coords, {
        color: "hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-3))",
        weight: 8,
      });
      polyline.addTo(overpassLayer);
      const popup = L.popup().setLatLng(coords[0]).setContent(`
        <h4>${name}</h4>
        <p>${tags["name:en"]}</p>
        <pre>${JSON.stringify(tags, null, 2)}</pre>
      `);
      polyline.bindPopup(popup);
    });
  };

  data.elements.forEach((element) => {
    if (element.type === "way") {
      renderWay(element);
    }
    if (element.type === "relation") {
      renderRelation(element);
    }
    if (element.type === "node") {
      renderNode(element);
    }
  });

  return {
    overpassLayer,
  };
}
