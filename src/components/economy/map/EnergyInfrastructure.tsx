// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import useOverpassAPI from "../../../hooks/useOverpassAPI";
import { useCallback } from "react";
import AtlasOSMInfoCard from "../../shared/AtlasOSMInfoCard";

export function EnergyInfrastructure({
  // Util
  isMobile,
  resetAtlas,
  sideBarRef,

  nexusSize,
  setNexusSize,

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

  // Data
  activeIndicator,
  setActiveIndicator,

  // Overpass Querries
  economicOverpassQueries,
  informationalOverpassQueries,
  diplomaticOverpassQueries,
  militaryOverpassQueries,
}) {
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

  const { data, isLoading } = useQuery({
    queryKey: [`OverpassData-${activeAdministrativeRegion["alpha-2"]}`],
    queryFn: () => useOverpassAPI(overpassQuery),
  });

  console.log(data);

  // Update Map to Selection

  const showOnMap = useCallback(
    (coords) => {
      console.log(coords);
      const mapBounds = [coords?.maxlat, coords?.minlon];
      map.flyTo(mapBounds, 14);
    },
    [map]
  );

  return (
    <div id="legend-content">
      {isLoading && <p className="search-loading-icon">🔍</p>}
      {data && (
        <small>
          {data?.elements.length} Power Plants found in{" "}
          {activeAdministrativeRegion["country"]}
        </small>
      )}
      {data &&
        data?.elements.map((element, index) => {
          return (
            <div key={index}>
              <AtlasOSMInfoCard element={element} />
              {element?.bounds && (
                <button type="button" onClick={() => showOnMap(element?.bounds)}>
                  📍
                </button>
              )}
              <br />
            </div>
          );
        })}
    </div>
  );
}

export default EnergyInfrastructure;
