import React from 'react';

import { useCallback, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ScaleControl,
} from 'react-leaflet';
import { Layer, LatLngExpression, latLngBounds, Path, Polyline } from 'leaflet';
import { FeatureCollection } from 'geojson';
import geojsonData from '../../assets/geojson/administrative_regions_extended.json';

import { baseLayers, overlayLayers } from './MapLayers';
import Minimap from './MiniMap';
import {
  AdministrativeRegionObject,
  AtlasInterfaceProps,
} from '../../types/atlas.types';

export default function AtlasMap({
  // Util
  isMobile,

  // Location
  map,
  setMap,

  isLocationSelectMode,

  nominatim,

  activeGeographicIdentifier,
  setActiveGeographicIdentifier,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,
}: AtlasInterfaceProps) {
  const administrativeRegionsData = geojsonData as FeatureCollection;
  /*
      Styles
  */
  const style_locationDefault = {
    color: 'hsl(var(--atlas-color-dark) / var(--atlas-opacity-3))',
    fillOpacity: 0,
    weight: 0.161,
  };

  const style_locationMuted = {
    color: 'hsl(var(--atlas-color-primary) / var(--atlas-opacity-2))',
    fillOpacity: 0.161,
    weight: 0.161,
  };

  const style_locationHover = {
    color: 'hsl(var(--atlas-color-light) / var(--atlas-opacity-2))',
    fillOpacity: 0.161,
    weight: 0.161,
  };

  const style_activeLocationHighlight = {
    color: 'hsl(var(--atlas-color-tertiary) / var(--atlas-opacity-2))',
    fillOpacity: 0.161,
    weight: 0.161,
  };

  const style_locationNameHighlight = {
    color: 'hsl(var(--atlas-color-tertiary))',
    fillOpacity: 0.161,
    weight: 1.161,
  };

  const onClickAdministrativeRegion = useCallback(
    (e, isDoubleCLick = false) => {
      const clickedAdministrativeRegion = e.target.feature.properties;
      if (activeAdministrativeRegion === clickedAdministrativeRegion) return;
      e.originalEvent.view.L.DomEvent.stopPropagation(e);
      if (isDoubleCLick) setActiveGeographicIdentifier('name');
      setActiveAdministrativeRegion(clickedAdministrativeRegion);
    },
    [map],
  );

  const onEachAdministrativeRegion = (
    administrativeRegion: { properties: AdministrativeRegionObject },
    layer: L.Layer,
  ) => {
    layer
      .bindPopup(
        `
      <div style="display: grid; grid-auto-flow: column; gap: var(--atlas-size-10); align-items: center;">
      <h3 style="margin: 0;" class="emoji">${administrativeRegion.properties['emoji']}</h3>
      <div>
      <b><i>${administrativeRegion.properties.name}</i></b><br>
      ${administrativeRegion.properties.country}
      </div>
      </div>
      `,
      )
      .getPopup();

    let tempStyle;

    layer.on({
      mouseover: (e) => {
        // Store the original style before applying hover style
        tempStyle = { ...e.target.options };
        if (!isLocationSelectMode) {
          e.target.setStyle(style_locationHover);
        }
      },

      mouseout: (e) => {
        if (!isLocationSelectMode && tempStyle) {
          // Restore the original style
          e.target.setStyle(tempStyle);
        }
      },

      click: (e: {
        target: {
          feature: { properties: AdministrativeRegionObject };
          getCenter: () => LatLngExpression;
        };
      }) => {
        onClickAdministrativeRegion(e);
      },
      dblclick: (e: {
        target: {
          feature: { properties: AdministrativeRegionObject };
          getCenter: () => LatLngExpression;
        };
      }) => {
        onClickAdministrativeRegion(e, true);
      },
    });
  };

  function updateMap() {
    // Initialize Empty LatLngBounds to keep extending
    const administrativeRegionArray = latLngBounds(
      null as unknown as LatLngExpression,
      null as unknown as LatLngExpression,
    );

    // Check if region needs an update
    if (
      activeAdministrativeRegion.country !== 'country' ||
      nominatim?.features[0]
    ) {
      const isNameMatch = (region, name) =>
        region.feature?.properties.name === name;
      const isCountryMatch = (region, country) =>
        region.feature?.properties.country === country;
      const isTypeMatch = (region, type, value) =>
        region.feature?.properties[type] === value;

      // Updates Map View on Location Type or Region Change
      map?.eachLayer((region: Layer) => {
        if (activeGeographicIdentifier === 'name') {
          if (
            !isNameMatch(region, nominatim?.features[0]?.properties.name) &&
            isNameMatch(region, activeAdministrativeRegion.name)
          ) {
            administrativeRegionArray.extend((region as Polyline).getBounds());
          }
        } else if (isCountryMatch(region, activeAdministrativeRegion.country)) {
          administrativeRegionArray.extend((region as Polyline).getBounds());
        }
      });

      // Highlight and Get Bounds
      map?.eachLayer((region: Layer) => {
        if (typeof (region as Path).setStyle === 'function' && !nominatim) {
          (region as Path).setStyle(style_locationMuted); // Mute all regions
        }

        if (
          isTypeMatch(
            region,
            activeGeographicIdentifier,
            activeAdministrativeRegion[activeGeographicIdentifier],
          )
        ) {
          (region as Path).setStyle(style_locationNameHighlight); // Highlight active location
        }

        if (isCountryMatch(region, activeAdministrativeRegion.country)) {
          (region as Path).setStyle(style_activeLocationHighlight); // Highlight country match
          if (
            isNameMatch(region, activeAdministrativeRegion.name) &&
            !nominatim
          ) {
            (region as Path).setStyle(style_locationNameHighlight); // Highlight name match
          }
        }

        if (
          !isNameMatch(region, nominatim?.features[0]?.properties.name) &&
          isTypeMatch(
            region,
            activeGeographicIdentifier,
            activeAdministrativeRegion[activeGeographicIdentifier],
          )
        ) {
          administrativeRegionArray.extend((region as Polyline).getBounds()); // Extend bounds for matched regions
        }
      });

      // Refreshes Map after initial region selection
      setTimeout(() => map?.invalidateSize(), 300);

      if (Object.keys(administrativeRegionArray).length !== 0) {
        map?.fitBounds(administrativeRegionArray);
      }
    }
  }

  useEffect(() => {
    updateMap();
  }, [activeAdministrativeRegion, activeGeographicIdentifier]);

  return (
    <MapContainer
      // center={[48.2082, 16.3738]} // Vienna; zoom 7
      // center={[35.8617, 104.1954]} // China; zoom 4
      // center={[55.7558, 37.6173]} // Moscow; zoom 5as GeoJsonObject
      center={[31.5017, 34.4668]} // Gaza; zoom 5
      zoom={5}
      maxZoom={18}
      scrollWheelZoom={true}
      placeholder={
        <noscript>You need to enable JavaScript to see this map.</noscript>
      }
      ref={setMap}
      worldCopyJump
    >
      <ScaleControl position="bottomleft" />
      <LayersControl position="bottomright">
        {baseLayers &&
          baseLayers.map((layer, index) => (
            <LayersControl.BaseLayer
              key={index}
              checked={layer.checked}
              name={layer.name}
            >
              <TileLayer
                url={layer.url}
                attribution={layer.attribution}
                maxZoom={layer.maxZoom}
                minZoom={layer.minZoom}
              />
            </LayersControl.BaseLayer>
          ))}
        {overlayLayers &&
          overlayLayers.map((layer, index) => (
            <LayersControl.Overlay
              key={index}
              checked={layer.checked}
              name={layer.name}
            >
              <TileLayer
                url={layer.url}
                attribution={layer.attribution}
                maxZoom={layer.maxZoom}
                minZoom={layer.minZoom}
                opacity={layer.opacity}
              />
            </LayersControl.Overlay>
          ))}
      </LayersControl>
      <GeoJSON
        data={administrativeRegionsData}
        style={style_locationDefault}
        onEachFeature={onEachAdministrativeRegion}
      />

      {!isMobile && (
        <Minimap position={'topleft'} zoom={3} size={'var(--atlas-size-02)'} />
      )}
    </MapContainer>
  );
}
