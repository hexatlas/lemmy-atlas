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
    } catch (error) {
      console.log(error);
    }
  };

  const apiUrl = `${isProleWiki ? 'https://en.prolewiki.org' : 'https://en.wikipedia.org/w'}/api.php?action=parse&page=${encodeURI(
    activeAdministrativeRegion[activeGeographicIdentifier],
  )}&format=json&origin=*&redirects`;

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
