import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ScaleControl,
  useMapEvent,
} from "react-leaflet";
import { LatLngExpression, latLng, latLngBounds } from "leaflet";
import { GeoJsonObject } from "geojson";
import administrativeRegionsData from "./data/administrative_regions_extended.json";

import { baseLayers, overlayLayers } from "./Atlas_Config";
import Minimap from "./AtlasMapMiniMap";
import Overpass from "./components/map/OverpassLayer";
import { useQuery } from "@tanstack/react-query";
import useOverpassAPI from "./hooks/useOverpassAPI";

/*
 /$$      /$$                    
| $$$    /$$$                    
| $$$$  /$$$$  /$$$$$$   /$$$$$$ 
| $$ $$/$$ $$ |____  $$ /$$__  $$
| $$  $$$| $$  /$$$$$$$| $$  \ $$
| $$\  $ | $$ /$$__  $$| $$  | $$
| $$ \/  | $$|  $$$$$$$| $$$$$$$/
|__/     |__/ \_______/| $$____/ 
                       | $$      
                       | $$      
                       |__/      
*/

export default function AtlasMap({
  // Util
  isMobile,
  resetAtlas,
  sideBarRef,

  legendSize,
  setLegendSize,

  // Location
  map,
  setMap,

  isOpenAtlasMapInterface,
  setIsOpenAtlasMapInterface,

  isLocationSelectMode,
  setIsLocationSelectMode,

  activeLocationSelection,
  setActiveLocationSelection,

  nominatim,
  setNominatim,

  regionTypes,
  activeLocationType,
  setActiveLocationType,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,
}) {
  /*
      Styles
  */
  const style_locationDefault = {
    color: "hsl(var(--atlas-color-dark) / var(--atlas-opacity-3))",
    fillOpacity: 0,
    weight: 0.161,
  };

  const style_locationMuted = {
    color: "hsl(var(--atlas-color-primary) / var(--atlas-opacity-2))",
    fillOpacity: 0.161,
    weight: 0.161,
  };

  const style_activeLocationHighlight = {
    color: "hsl(var(--atlas-color-tertiary))",
    fillOpacity: 0.161,
    weight: 0.161,
  };

  const style_locationNameHighlight = {
    color: "hsl(var(--atlas-color-tertiary))",
    fillOpacity: 0.161,
    weight: 1.161,
  };

  const onClickAdministrativeRegionCallback = (e, isDoubleCLick = false) => {
    e.originalEvent.view.L.DomEvent.stopPropagation(e);
    const clickedAdministrativeRegion = e.target.feature.properties;
    if (isDoubleCLick) setActiveLocationType("name");
    setActiveAdministrativeRegion(clickedAdministrativeRegion);
  };

  const onClickAdministrativeRegion = useCallback(onClickAdministrativeRegionCallback, [
    map,
  ]);

  const onEachAdministrativeRegion = (administrativeRegion: any, layer: any) => {
    layer
      .bindPopup(
        `
      <div style="display: grid; grid-auto-flow: column; gap: var(--atlas-size-10); align-items: center;">
        <h3 style="margin: 0;">${administrativeRegion.properties["emoji"]}</h3>
        <div>
          <b><i>${administrativeRegion.properties.name}</i></b><br>
          ${administrativeRegion.properties.country}
        </div>
      </div>
    `
      )
      .getPopup()
      .on("remove", function () {
        resetAtlas();
      });

    layer.on({
      mouseover: (e) => {
        // Highlight AdministrativeRegions on mouse hover
        // if (!isLocationSelectMode) e.target?.setStyle(style_activeLocationHighlight);
      },

      mouseout: (e) => {
        // if (!isLocationSelectMode) e.target?.setStyle(style_locationDefault);
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

    if (activeAdministrativeRegion.country !== "country" || nominatim?.features[0]) {
      /* Updates Map View on Location Type or Region Change */
      switch (activeLocationType) {
        case "name":
          map?.eachLayer((administrativeRegion) => {
            if (
              administrativeRegion.feature?.properties.name !==
              nominatim?.features[0].properties.name
            )
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

      /* Highlightcs Location on Map by Setting Styles */
      map?.eachLayer((administrativeRegion) => {
        // Highlight Locationselection
        if (typeof administrativeRegion?.setStyle === "function" && !nominatim)
          administrativeRegion?.setStyle(style_locationMuted);

        // activeLocationType Highlight
        if (
          administrativeRegion.feature?.properties[activeLocationType] ===
          activeAdministrativeRegion[activeLocationType]
        )
          administrativeRegion?.setStyle(style_activeLocationHighlight);

        // activeAdministrativeRegion.name Highlight
        if (
          administrativeRegion.feature?.properties.country ===
          activeAdministrativeRegion.country
        ) {
          administrativeRegion?.setStyle(style_activeLocationHighlight);
          if (
            administrativeRegion.feature?.properties.name ===
              activeAdministrativeRegion.name &&
            !nominatim
          ) {
            administrativeRegion?.setStyle(style_locationNameHighlight);
          }
        }

        // Get Bounds
        if (
          administrativeRegion.feature?.properties.name !==
          nominatim?.features[0].properties.name
        ) {
          if (
            administrativeRegion.feature?.properties[activeLocationType] ===
            activeAdministrativeRegion[activeLocationType]
          )
            administrativeRegionArray.extend(administrativeRegion.getBounds());
        }
      });

      // Refreshes Map after initial region selection
      setTimeout(() => map.invalidateSize(), 300);

      if (Object.keys(administrativeRegionArray).length !== 0) {
        map?.fitBounds(administrativeRegionArray);
      }
    }
  }, [activeAdministrativeRegion, activeLocationType]);

  const overpassQuery = `
  [out:json][timeout:25];
  
  // Fetch area for the selected region
  area["ISO3166-1"="${activeAdministrativeRegion["alpha-2"]}"]->.name;
  (
    // Fetch features based on the active location type (e.g., aerodromes)
    nwr["power"="plant"](area.name);
  );
  
  out geom;
  `;

  const { data } = useQuery({
    queryKey: [`Energy-${activeAdministrativeRegion["alpha-2"]}`],
    queryFn: () => useOverpassAPI(overpassQuery),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return (
    <MapContainer
      // center={[48.2082, 16.3738]} // Vienna; zoom 7
      // center={[35.8617, 104.1954]} // China; zoom 4
      // center={[55.7558, 37.6173]} // Moscow; zoom 5as GeoJsonObject
      center={[31.5017, 34.4668]} // Gaza; zoom 5
      zoom={5}
      maxZoom={18}
      scrollWheelZoom={true}
      placeholder={<noscript>You need to enable JavaScript to see this map.</noscript>}
      ref={setMap}
      worldCopyJump
    >
      <Overpass data={data} />
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
        data={administrativeRegionsData?.features as unknown as GeoJsonObject}
        style={style_locationDefault}
        onEachFeature={onEachAdministrativeRegion}
      />

      {!isMobile && (
        <Minimap position={"topleft"} zoom={3} size={"var(--atlas-size-02)"} />
      )}
    </MapContainer>
  );
}
