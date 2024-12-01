import { useQuery } from '@tanstack/react-query';
import React from 'react';

function useNewsBulletins(activeAdministrativeRegion) {
  const fetchBulletinsRSS = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const xmlString = await response.text(); // Retrieve response as text

      const parser = new DOMParser();
      const xmlData = parser.parseFromString(xmlString, 'text/xml');

      const items = Array.from(xmlData.getElementsByTagName('item')).map(
        (item) => ({
          title: item.querySelector('title').textContent,
          link: item.querySelector('link').textContent,
          pubDate: item.querySelector('pubDate').textContent,
          description: item.querySelector('description').textContent,
        }),
      );

      const parsedData = {
        title: xmlData.querySelector('title').textContent,
        link: xmlData.querySelector('link').textContent,
        description: xmlData.querySelector('description').textContent,
        generator: xmlData.querySelector('generator').textContent,
        language: xmlData.querySelector('language').textContent,
        lastBuildDate: xmlData.querySelector('lastBuildDate').textContent,
        items: items,
      };

      return parsedData;
    } catch (error) {
      console.log(error);
    }
  };

  let apiUrl = null;

  if (activeAdministrativeRegion.country !== 'country') {
    apiUrl = `/.netlify/functions/72T_bulletins/?country=${encodeURI(
      activeAdministrativeRegion.country,
    )
      .toLowerCase()
      .replace(/%20/g, '-')}`;
  } else {
    apiUrl = `/.netlify/functions/72T_bulletins/?index=true`;
  }

  const { data: newsBulletinsPosts, isLoading } = useQuery({
    queryKey: [`newsBulletins-${activeAdministrativeRegion['alpha-2']}`],
    queryFn: () => fetchBulletinsRSS(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return { newsBulletinsPosts, isLoading };
}

export default useNewsBulletins;
