function AtlasOSMInfoCard({ element }) {
  const { name, wikidata } = element?.tags;
  return (
    <>
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
