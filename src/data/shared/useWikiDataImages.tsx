import React from 'react';
import { useQuery } from '@tanstack/react-query';

function useWikiDataImages(wikidata) {
  const apiUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidata}&props=claims&format=json&origin=*`;

  const { data: imagesArray, isLoading } = useQuery({
    queryKey: [`wikidata-${wikidata}`],
    queryFn: () => fetchImageData(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  const fetchImageData = async (apiUrl) => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const entity = data.entities[wikidata];
      if (!entity?.claims?.P18) return [];

      // Process all image claims
      return entity.claims.P18.filter(
        (claim) => claim.mainsnak?.datavalue?.value,
      ) // Filter valid claims
        .map((claim) => {
          const filename = claim.mainsnak.datavalue.value;

          // Format filename and create URL
          const formattedFilename = filename
            .replace(/ /g, '_') // Replace spaces with underscores
            .replace(/"/g, ''); // Remove quotes if present

          return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(formattedFilename)}`;
        });
    } catch (error) {
      console.error('Error fetching Wikidata data:', error);
      return [];
    }
  };

  return [imagesArray, isLoading];
}

export default useWikiDataImages;
