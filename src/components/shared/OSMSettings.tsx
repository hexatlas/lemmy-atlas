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
    <div
      className="overpass-settings-container light"
      aria-label="overpass settings"
    >
      <div className="container-info secondary" aria-hidden>
        ⚙️
      </div>
      <button
        type="button"
        onClick={() => setIsClustered(!isClustered)}
        aria-description="cluster toggle"
        aria-checked={isClustered}
      >
        {isClustered ? '🗂️' : '📍'}
      </button>
      <button
        type="button"
        onClick={() => setIsClustered(!isClustered)}
        aria-description="bounding box toggle"
        aria-checked={isClustered}
      >
        {isClustered ? '🗺️' : '🔲'}
      </button>
      {Children}
    </div>
  );
}

export default AtlasOSMSettings;
