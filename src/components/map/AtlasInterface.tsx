import React from 'react';

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';

import { AtlasInterfaceProps } from '../../types/atlas.types';
import AtlasLocationSearch from '../shared/AtlasLocationSearch';
import AtlasGeographyOptions from '../shared/AtlasGeographyOptions';

export default function AtlasInterface({
  // Util
  isMobile,

  // legendSize,
  setLegendSize,

  // Location
  isOpenAtlasMapInterface,
  setIsOpenAtlasMapInterface,
}: AtlasInterfaceProps) {
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
    <Collapsible.Root
      className="map-interface-container"
      open={isOpenAtlasMapInterface}
      onOpenChange={setIsOpenAtlasMapInterface}
    >
      <div className="right-slot">
        <Collapsible.Trigger asChild>
          <button
            className="atlas-expand-button"
            title="Click to Expand and Collapse"
          >
            {isMobile ? '☰' : isOpenAtlasMapInterface ? '➖' : '➕'}
          </button>
        </Collapsible.Trigger>
      </div>

      {!isMobile && (
        <>
          <button
            role="button"
            title="Click and Drag to Resize"
            aria-label="Resize Button. Click and Drag to Resize"
            className="legend-resize-button"
            onMouseDown={handleNexusResize}
          >
            ↔️
          </button>
          {/* <button
          role="button"
          title="Select Locations"
          aria-label="Click to Select Locations"
          className="legend-resize-button"
          onMouseDown={handleLocationSelection}
          >
          🖊️
          </button> */}
        </>
      )}
      <AtlasLocationSearch></AtlasLocationSearch>

      <Collapsible.Content>
        <AtlasGeographyOptions />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
