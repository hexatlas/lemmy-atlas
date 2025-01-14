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
    <div className="settings light" aria-label="overpass settings">
      <div className="settings__label secondary" aria-hidden>
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

export default React.memo(AtlasOSMSettings);
