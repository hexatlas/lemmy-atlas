import { Children } from "react";

function AtlasOSMSettings({ isClustered, setIsClustered, Children = <></> }) {
  return (
    <div className="overpass-settings-container light">
      <div className="container-info secondary">⚙️</div>
      <button type="button" onClick={() => setIsClustered(!isClustered)}>
        {isClustered ? "🗂️" : "📍"}
      </button>
      {Children}
    </div>
  );
}

export default AtlasOSMSettings;
