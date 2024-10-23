import { useCallback, useEffect } from "react";
import Overpass from "../map/OverpassLayer";
import L from "leaflet";

function AtlasOSMInfoCard({ map, element }) {
  const { name, wikidata } = element?.tags;

  // Update Map to Selection
  const showOnMap = useCallback(
    (element) => {
      if (element.lat && element.lon) map.flyTo([element.lat, element.lon], 15);

      if (element?.bounds)
        map.flyToBounds([
          [element.bounds?.minlat, element.bounds?.minlon],
          [element.bounds?.maxlat, element.bounds?.maxlon],
        ]);
    },
    [map]
  );

  return (
    <>
      <button type="button" onClick={() => showOnMap(element)}>
        📍
      </button>

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
