import React from 'react';

import { AtlasInterfaceProps } from '../../types/atlas.types';
import AtlasLocationSearch from '../shared/LocationSearch';
import AtlasGeographyOptions from '../shared/GeographyOptions';

function AtlasInterface({ isMobile }: AtlasInterfaceProps) {
  console.count('<AtlasInterface />');
  /* 
    Handlers
 */

  // const handleLocationSelection = () => {
  //   resetAtlas();
  //   setIsOpenAtlasMapInterface(true);
  //   setIsLocationSelectMode(!isLocationSelectMode);
  // };

  return (
    <div className="map-interface">
      {!isMobile && (
        <>
          {/* <button
            role="button"
            title="Select Locations"
            aria-label="Click to Select Locations"
            className="settings"
            onMouseDown={handleLocationSelection}
          >
            🖊️
          </button> */}
        </>
      )}
      <AtlasLocationSearch />
      <AtlasGeographyOptions />
    </div>
  );
}

export default React.memo(AtlasInterface);
