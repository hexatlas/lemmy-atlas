import { useQuery } from '@tanstack/react-query';

function useWiki(
  activeAdministrativeRegion,
  activeGeographicIdentifier,
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
    } catch (error) {}
  };

  const apiUrl = `${import.meta.env.VITE_DATA_API_ENDPOINT}${isProleWiki ? 'prolewiki' : 'natopedia'}?country=${encodeURI(
    activeAdministrativeRegion[activeGeographicIdentifier],
  )}`;

  const { data: wikiData, isLoading } = useQuery({
    queryKey: [
      `wiki-${isProleWiki ? 'prole' : 'nato'}-${activeAdministrativeRegion[activeGeographicIdentifier]}`,
    ],
    queryFn: () => fetchProleWiki(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return { wikiData, isLoading };
}

export default useWiki;
