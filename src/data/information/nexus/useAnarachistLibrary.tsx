import { useQuery } from '@tanstack/react-query';

function useAnarachistLibrary(
  activeAdministrativeRegion,
  activeGeographicIdentifier,
) {
  const fetchAnarchistLibrary = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const AnarchistLibraryArray = await response.json(); // Retrieve response as text

      return AnarchistLibraryArray;
    } catch (error) {
      console.log(error);
    }
  };

  let apiUrl;

  if (activeAdministrativeRegion?.country !== 'country') {
    apiUrl = `${import.meta.env.VITE_DATA_API_ENDPOINT}anarchist_library?country=${encodeURI(
      activeAdministrativeRegion[activeGeographicIdentifier],
    )}`;
  } else {
    apiUrl = `${import.meta.env.VITE_DATA_API_ENDPOINT}anarchist_library/`;
  }

  const { data: anarchistLibraryPosts, isLoading } = useQuery({
    queryKey: [`anarchistLibrary-${activeAdministrativeRegion['ISO3166-2']}`],
    queryFn: () => fetchAnarchistLibrary(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return { anarchistLibraryPosts, isLoading };
}

export default useAnarachistLibrary;
