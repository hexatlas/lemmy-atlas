import React from 'react';
import { useQuery } from '@tanstack/react-query';

function useAnarachistLibrary(activeAdministrativeRegion, activeLocationType) {
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

  let apiUrl = null;

  if (activeAdministrativeRegion.country !== 'country') {
    apiUrl = `/.netlify/functions/anarchist_library/?country=${encodeURI(
      activeAdministrativeRegion[activeLocationType],
    )}`;
  } else {
    apiUrl = `/.netlify/functions/anarchist_library/`;
  }

  const { data: anarchistLibraryPosts, isLoading } = useQuery({
    queryKey: [`anarchistLibrary-${activeAdministrativeRegion['alpha-2']}`],
    queryFn: () => fetchAnarchistLibrary(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return { anarchistLibraryPosts, isLoading };
}

export default useAnarachistLibrary;
