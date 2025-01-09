import React, { useCallback, useState } from 'react';
// https://www.radix-ui.com/primitives/docs/components/accordion
import * as Accordion from '@radix-ui/react-accordion';
import AtlasOSMInfoCard from './OSMInfoCard';

import { OSMInfoListProps } from '../../types/atlas.types';
import { LatLngBoundsExpression } from 'leaflet';

function AtlasOSMInfoList({
  listName,
  map,
  iconMap,
  filterKeys,
  data,
  activeAdministrativeRegion,
}: OSMInfoListProps) {
  const [lastMapBounds, setLastMapBounds] = useState<
    LatLngBoundsExpression | undefined
  >(map?.getBounds());
  const [activeElement, setActiveElement] = useState(null);

  const showOnMap = useCallback(
    (element) => {
      if (element.lat && element.lon) {
        map?.flyTo([element.lat, element.lon], 15, { duration: 2.7 });
      } else if (element?.bounds) {
        map?.flyToBounds(
          [
            [element.bounds.minlat, element.bounds.minlon],
            [element.bounds.maxlat, element.bounds.maxlon],
          ],
          { duration: 2.7 },
        );
      }
    },
    [map],
  );

  const handleClick = (element) => {
    if (element.lat && element.lon) {
      setLastMapBounds([
        [element.lat, element.lon],
        [element.lat, element.lon],
      ] as LatLngBoundsExpression);
    } else if (element?.bounds) {
      setLastMapBounds([
        [element.bounds.minlat, element.bounds.minlon],
        [element.bounds.maxlat, element.bounds.maxlon],
      ] as LatLngBoundsExpression);
    }
    if (element) setActiveElement(element);
    if (element === activeElement) setActiveElement(null);
    showOnMap(element);
  };

  let debounce: NodeJS.Timeout;

  const handleMouseEnter = (element) => {
    debounce = setTimeout(() => {
      setLastMapBounds(map?.getBounds());
      showOnMap(element);
    }, 450);
  };

  const handleMouseLeave = () => {
    clearTimeout(debounce);
    map?.flyToBounds(lastMapBounds as LatLngBoundsExpression, {
      duration: 1.35,
    });
  };

  return (
    <>
      <Accordion.Root
        type="multiple"
        className="overpass-list"
        role="list"
        aria-label={`${listName} in ${activeAdministrativeRegion['country']}`}
        aria-description={`List of ${listName} in ${activeAdministrativeRegion['country']}`}
        aria-live="polite"
        id="overpass-list"
      >
        {data &&
          data.map((element, index) => {
            return (
              <AtlasOSMInfoCard
                key={index}
                index={index}
                element={element}
                // map={map}
                iconMap={iconMap}
                filterKeys={filterKeys}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleClick={handleClick}
                activeElement={activeElement}
              ></AtlasOSMInfoCard>
            );
          })}
      </Accordion.Root>
    </>
  );
}

export default AtlasOSMInfoList;
