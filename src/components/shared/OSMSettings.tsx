import React, { ReactNode } from 'react';

interface OSMSettingsType {
  isClustered: boolean;
  setIsClustered: (isClustered: boolean) => void;
  Children?: ReactNode;
}

function AtlasOSMSettings({
  isClustered,
  setIsClustered,
  Children = <></>,
}: OSMSettingsType) {
  return (
    <div className="overpass-settings-container light">
      <div className="container-info secondary">⚙️</div>
      <button type="button" onClick={() => setIsClustered(!isClustered)}>
        {isClustered ? '🗂️' : '📍'}
      </button>
      <button type="button" onClick={() => setIsClustered(!isClustered)}>
        {isClustered ? '🗺️' : '🔲'}
      </button>
      {Children}
    </div>
  );
}

export default AtlasOSMSettings;
