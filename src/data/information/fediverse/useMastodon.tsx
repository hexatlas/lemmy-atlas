import { useQuery } from '@tanstack/react-query';

function useMastodon(activeAdministrativeRegion, activeGeographicIdentifier) {
  let apiUrl;

  if (activeAdministrativeRegion.country !== 'country') {
    apiUrl = `/.netlify/functions/mastodon/?country=${encodeURI(
      activeAdministrativeRegion[activeGeographicIdentifier],
    )
      .toLowerCase()
      .replace(/%20/g, '-')}`;
  }

  const { data: mastodonPosts, isLoading } = useQuery({
    queryKey: [
      `mastodon-${activeAdministrativeRegion[activeGeographicIdentifier]}`,
    ],
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
  return { mastodonPosts, isLoading };
}

export default useMastodon;
