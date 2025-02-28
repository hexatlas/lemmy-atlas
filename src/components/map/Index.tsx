import React from 'react';

import { useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ScaleControl,
} from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { FeatureCollection } from 'geojson';
import geojsonData from '../../assets/geojson/administrative_regions_extended.json';

import { baseLayers, overlayLayers } from './MapLayers';
import Minimap from './MiniMap';
import {
  AdministrativeRegionObject,
  AtlasInterfaceProps,
} from '../../types/atlas.types';
import UpdateURL from './UpdateURL';

export default function AtlasMap({
  // Util
  isMobile,
  route,

  // Location
  map,
  setMap,

  isLocationSelectMode,
  setActiveGeographicIdentifier,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,
}: AtlasInterfaceProps) {
  const administrativeRegionsData = geojsonData as FeatureCollection;
  /*
      Styles
  */
  const style_locationDefault = {
    color: 'var(--surface-atlas-disabled)',
    fillOpacity: 0.161,
    weight: 0.161,
  };

  const style_locationHover = {
    color: 'var(--surface-atlas-option)',
    fillOpacity: 0.161,
    weight: 0.161,
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
        <div style="display: grid; grid-auto-flow: column; gap: var(--size-atlas-10); align-items: center;">
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
      <UpdateURL route={route} map={map} />
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
        <Minimap position={'topleft'} zoom={3} size={'var(--size-atlas-02)'} />
      )}
    </MapContainer>
  );
}
