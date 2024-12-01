import React from 'react';
import { useQuery } from '@tanstack/react-query';

function useMastodon(activeAdministrativeRegion, activeLocationType) {
  let apiUrl;

  if (activeAdministrativeRegion.country !== 'country') {
    apiUrl = `/.netlify/functions/mastodon/?country=${encodeURI(
      activeAdministrativeRegion[activeLocationType],
    )
      .toLowerCase()
      .replace(/%20/g, '-')}`;
  }

  const { data: mastodonPosts, isLoading } = useQuery({
    queryKey: [`mastodon-${activeAdministrativeRegion[activeLocationType]}`],
    queryFn: () => featchMastodon(apiUrl),
  });

  const featchMastodon = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const mastondonPostsData = await response.json(); // Retrieve response as text
      return mastondonPostsData;
    } catch (error) {
      console.log(error);
    }
  };
  return mastodonPosts;
}

export default useMastodon;
