import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ScaleControl,
  useMap,
} from "react-leaflet";
import { LatLngExpression, latLngBounds } from "leaflet";
import { GeoJsonObject } from "geojson";
import administrativeRegionsData from "./data/administrative_regions_extended.json";

import { baseLayers, overlayLayers } from "./Atlas_Config";
import Minimap from "./AtlasMapMiniMap";

export default function AtlasMap({
  // Util
  isMobile,
  resetAtlas,

  nexusSize,
  setNexusSize,

  // Location
  map,
  setMap,

  regionTypes,
  activeRegionType,
  setActiveRegionType,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,

  // Data
  activeIndicator,
  setActiveIndicator,

  // Community
  lemmyInstances,
  activeLemmyInstance,
  setActiveLemmyInstance,

  activeCommunity,
  setActiveCommunity,

  activeSearchType,
  setActiveSearchType,

  listingTypes,
  activeListingType,
  setActiveListingType,

  sortTypes,
  activeSortType,
  setActiveSortType,

  // Styles
  administrativeRegionStyle,
  administrativeRegionStyleHovered,
}) {
  const onClickAdministrativeRegion = (e, isDoubleCLick = false) => {
    const clickedAdministrativeRegion = e.target.feature.properties;
    if (isDoubleCLick) setActiveRegionType("AdministrativeRegion");
    setActiveAdministrativeRegion(clickedAdministrativeRegion);
  };

  const onEachAdministrativeRegion = (administrativeRegion: any, layer: any) => {
    layer.bindPopup(
      `<i>${administrativeRegion.properties.name}</i>, ${administrativeRegion.properties.country} | ${administrativeRegion.properties["ISO3166-1-Alpha-3"]}`
    );

    layer.on({
      mouseover: (e) => {
        // Highlight AdministrativeRegions on mouse hover
        e.target?.setStyle(administrativeRegionStyleHovered);
      },

      mouseout: (e) => {
        e.target?.setStyle(administrativeRegionStyle);
      },
      click: (e: {
        target: {
          options: any;
          feature: { properties: { [x: string]: any } };
          getCenter: () => LatLngExpression;
        };
      }) => {
        onClickAdministrativeRegion(e);
      },
      dblclick: (e: {
        target: {
          options: any;
          feature: { properties: { [x: string]: any } };
          getCenter: () => LatLngExpression;
        };
      }) => {
        onClickAdministrativeRegion(e, true);
      },
    });
  };

  useEffect(() => {
    let administrativeRegionArray = latLngBounds(null, null);
    if (activeAdministrativeRegion.country !== "Country") {
      switch (activeRegionType) {
        case "AdministrativeRegion":
          map?.eachLayer((administrativeRegion) => {
            if (
              administrativeRegion.feature?.properties.name ===
              activeAdministrativeRegion.name
            )
              administrativeRegionArray.extend(administrativeRegion.getBounds());
          });
          break;
        default:
          map?.eachLayer((administrativeRegion) => {
            if (
              administrativeRegion.feature?.properties.country ===
              activeAdministrativeRegion.country
            )
              administrativeRegionArray.extend(administrativeRegion.getBounds());
          });
          break;
      }
      // Refreshes Map after initial region selection
      setTimeout(() => map.invalidateSize(), 300);
      map?.fitBounds(administrativeRegionArray);
    }
  }, [activeAdministrativeRegion, activeRegionType]);

  return (
    <MapContainer
      // center={[48.2082, 16.3738]} // Vienna; zoom 7
      // center={[35.8617, 104.1954]} // China; zoom 4
      // center={[55.7558, 37.6173]} // Moscow; zoom 5as GeoJsonObject
      center={[31.5017, 34.4668]} // Gaza; zoom 5
      zoom={5}
      // maxZoom={10}
      maxZoom={18}
      scrollWheelZoom={true}
      placeholder={<noscript>You need to enable JavaScript to see this map.</noscript>}
      ref={setMap}
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
            <LayersControl.Overlay key={index} checked={layer.checked} name={layer.name}>
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
        data={administrativeRegionsData as GeoJsonObject}
        style={administrativeRegionStyle}
        onEachFeature={onEachAdministrativeRegion}
      />
      {!isMobile && (
        <Minimap position={"topleft"} zoom={3} size={"var(--atlas-size-00)"} />
      )}
    </MapContainer>
  );
}
