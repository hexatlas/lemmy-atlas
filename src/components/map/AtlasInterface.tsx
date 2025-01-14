import React from 'react';

import { AtlasInterfaceProps } from '../../types/atlas.types';
import AtlasLocationSearch from '../shared/AtlasLocationSearch';
import AtlasGeographyOptions from '../shared/AtlasGeographyOptions';
import { setActiveGeographicIdentifier } from '../../reducer/actions';

function AtlasInterface({
  // Util
  isMobile,

  // legendSize,
  setLegendSize,
}: AtlasInterfaceProps) {
  console.count('<AtlasInterface />');
  /* 
    Handlers
 */
  const handleNexusResize = () => {
    function onMouseMove(mouseMoveEvent) {
      setLegendSize(document.body.clientWidth - mouseMoveEvent.clientX);
    }
    function onMouseUp() {
      document.body.removeEventListener('mousemove', onMouseMove);
    }
    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp, { once: true });
  };
  // const handleLocationSelection = () => {
  //   resetAtlas();
  //   setIsOpenAtlasMapInterface(true);
  //   setIsLocationSelectMode(!isLocationSelectMode);
  // };

  /*
    Component
  */

  return (
    <div className="map-interface">
      {!isMobile && (
        <>
          <button
            role="button"
            title="Click and Drag to Resize"
            aria-label="Resize Button. Click and Drag to Resize"
            className="map-interface__resize"
            onMouseDown={handleNexusResize}
          >
            ↔️
          </button>
          {/* <button
            role="button"
            title="Select Locations"
            aria-label="Click to Select Locations"
            className="map-interface__resize"
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
