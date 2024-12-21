import { useQuery } from '@tanstack/react-query';

function useMastodon(activeAdministrativeRegion, activeGeographicIdentifier) {
  let apiUrl;

  if (activeAdministrativeRegion.country !== 'country') {
    apiUrl = `https://mastodon.social/api/v1/timelines/tag/${encodeURI(
      activeAdministrativeRegion[activeGeographicIdentifier],
    )
      .toLowerCase()
      .replace(/%20/g, '-')}`;
  }

  const { data: mastodonPosts, isLoading } = useQuery({
    queryKey: [
      `mastodon-${activeAdministrativeRegion[activeGeographicIdentifier]}`,
    ],
    queryFn: () => fetchMastodon(apiUrl),
  });

  const fetchMastodon = async (url) => {
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
