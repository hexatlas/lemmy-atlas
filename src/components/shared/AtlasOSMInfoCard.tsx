import { useCallback, useEffect } from "react";
import Overpass from "../map/OverpassLayer";

function AtlasOSMInfoCard({ map, element }) {
  const { name, wikidata } = element?.tags;

  // Update Map to Selection
  const showOnMap = useCallback(
    (coords) => {
      const mapBounds = [coords?.maxlat, coords?.minlon];
      map.flyTo(mapBounds, 14);
    },
    [map]
  );

  return (
    <>
      {element?.bounds && (
        <button type="button" onClick={() => showOnMap(element?.bounds)}>
          📍
        </button>
      )}
      <h4>{name || element?.tags["name:en"]}</h4>
      {wikidata ? (
        <a
          href={`https://www.wikidata.org/wiki/${wikidata}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 {element?.tags["name:en"] || name || "Wikidata"}
        </a>
      ) : (
        <p>{element?.tags["name:en"] || "⚡"}</p>
      )}

      <pre>{JSON.stringify(element?.tags, undefined, 2)}</pre>
    </>
  );
}

export default AtlasOSMInfoCard;
