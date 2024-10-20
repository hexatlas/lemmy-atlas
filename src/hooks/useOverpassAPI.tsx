async function useOverpassAPI(query, url?) {
  const encodedQuery = encodeURIComponent(query);
  const overpassApiUrl = `${
    url || "https://overpass-api.de/api/interpreter"
  }?data=${encodedQuery}`;

  try {
    const response = await fetch(overpassApiUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json, "useOverpassAPI");

    return json;
  } catch (error) {
    console.error(error.message);
  }
}

export default useOverpassAPI;
