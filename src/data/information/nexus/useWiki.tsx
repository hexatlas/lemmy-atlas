import { useQuery } from '@tanstack/react-query';

function useWiki(
  activeAdministrativeRegion,
  activeLocationType,
  wikiURL,
  isProleWiki,
) {
  const fetchProleWiki = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      return result?.parse;
    } catch (error) {
      console.log(error);
    }
  };

  const apiUrl = `/.netlify/functions/wiki/?country=${encodeURI(
    activeAdministrativeRegion[activeLocationType],
  )}&wiki=${wikiURL}`;

  const { data: wikiData, isLoading } = useQuery({
    queryKey: [
      `wiki-${isProleWiki ? 'prole' : 'nato'}-${activeAdministrativeRegion[activeLocationType]}`,
    ],
    queryFn: () => fetchProleWiki(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return { wikiData, isLoading };
}

export default useWiki;
