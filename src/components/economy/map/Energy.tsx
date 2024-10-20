// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { useCallback, useEffect } from "react";
import AtlasOSMInfoCard from "../../shared/AtlasOSMInfoCard";
import useEconomyEnergy from "../../../hooks/overpass/useEconomyEnergy";
import Overpass from "../../map/OverpassLayer";
import L from "leaflet";
import { iconMap } from "../../map/economy/Energy";

export function Energy({
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
  const { data, isLoading } = useEconomyEnergy(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = Overpass(map, data, iconMap, "plant:source");
    }
    return () => {
      if (layerObjects) {
        map.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, data]);

  // Update Map to Selection

  const showOnMap = useCallback(
    (coords) => {
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

export default Energy;
