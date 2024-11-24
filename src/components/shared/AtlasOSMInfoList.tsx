import { useCallback, useState } from "react";
import AtlasOSMInfoCard from "./AtlasOSMInfoCard";

function AtlasOSMInfoList({
  listName,
  map,
  iconMap,
  filterKeys,
  data,
  activeAdministrativeRegion,
}) {
  const [lastMapBounds, setLastMapBounds] = useState(map.getBounds()); // Store the last map bounds
  const [activeElement, setActiveElement] = useState(null);

  // Function to zoom to a specific element
  const showOnMap = useCallback(
    (element) => {
      if (element.lat && element.lon) {
        map.flyTo([element.lat, element.lon], 15), { duration: 2.7 };
      } else if (element?.bounds) {
        map.flyToBounds(
          [
            [element.bounds.minlat, element.bounds.minlon],
            [element.bounds.maxlat, element.bounds.maxlon],
          ],
          { duration: 2.7 }
        );
      }
    },
    [map]
  );

  const handleClick = (element) => {
    if (element.lat && element.lon) {
      setLastMapBounds([
        [element.lat, element.lon],
        [element.lat, element.lon],
      ]);
    } else if (element?.bounds) {
      setLastMapBounds([
        [element.bounds.minlat, element.bounds.minlon],
        [element.bounds.maxlat, element.bounds.maxlon],
      ]);
    }
    if (element) setActiveElement(element);
    if (element === activeElement) setActiveElement(null);
    showOnMap(element);
  };

  // Hover handlers
  const handleMouseEnter = (element) => {
    setLastMapBounds(map.getBounds()); // Save the current map bounds
    showOnMap(element); // Fly to the hovered element
  };

  const handleMouseLeave = () => {
    map.flyToBounds(lastMapBounds, { duration: 1.35 }); // Revert to the last saved bounds
  };

  return (
    <div className="light">
      {data && (
        <h6>
          {data?.elements.length} {listName} found in{" "}
          {activeAdministrativeRegion["country"]}
        </h6>
      )}
      <div className="overpass-list">
        {data &&
          data?.elements.map((element, index) => {
            return (
              <AtlasOSMInfoCard
                key={index}
                element={element}
                map={map}
                iconMap={iconMap}
                filterKeys={filterKeys}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleClick={handleClick}
                activeElement={activeElement}
              ></AtlasOSMInfoCard>
            );
          })}
      </div>
    </div>
  );
}

export default AtlasOSMInfoList;
