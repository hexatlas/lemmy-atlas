// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { ListCommunities, LemmyHttp, Search } from 'lemmy-js-client';
import { useEffect, useState } from 'react';

// ToDo: Implement React Query

function useLemmy(
  // Util
  sideBarRef,

  // Location
  activeGeographicIdentifier,
  activeAdministrativeRegion,
  locationQuery,
  setLocationQuery,

  // Community
  activeLemmyInstance,

  activeCommunity,
  setActiveCommunity,

  activeSearchType,
  activeListingType,

  activeSortType,
) {
  const [communityList, setCommunityList] = useState(null);
  const [currentCommunityPage, setCurrentCommunityPage] = useState(1);
  const [hasMoreCommunities, setHasMoreCommunities] = useState(true);

  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentSearchResultPage, setCurrentSearchResultPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  // ToDo: Infinite Scroll

  const handleScroll = () => {
    // Check if user has scrolled to the bottom
    if (sideBarRef.current.scrollTop > sideBarRef.current.scrollTopMax - 69) {
      // Fetch more comments if there are more to fetch
      if (hasMore) {
        console.log('SCROLL');

        setCurrentSearchResultPage(currentSearchResultPage + 1);
      }
    }
  };

  /*
    Handlers
  */

  function handleSearchQuery() {
    return `${locationQuery} ${
      activeAdministrativeRegion['country'] === 'country'
        ? ''
        : activeAdministrativeRegion[activeGeographicIdentifier]
    }`;
  }

  const client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);
  const form: Search = {
    community_id: activeCommunity?.counts?.community_id,
    type_: activeSearchType.value,
    listing_type: activeListingType.value,
    sort: activeSortType.value,
    q: handleSearchQuery(),
    page: currentSearchResultPage,
  };

  function handleUpdate() {
    console.log(posts, comments);

    if (locationQuery) {
      setCurrentCommunityPage(1);
      handleSearchCommunities(locationQuery);
    } else {
      handleCommunityList();
    }

    client.search(form).then((res) => {
      // setPosts([]);
      // setComments([]);

      if (activeSearchType.value === 'Comments') {
        setPosts([]);
        if (res?.comments.length < 10) {
          setHasMore(false);
        }
        if (comments && res?.comments) setComments(res?.comments);
      }

      if (activeSearchType.value === 'Posts') {
        setComments([]);
        if (res?.posts.length < 10) {
          setHasMore(false);
        }
        if (posts && res?.posts) setPosts(res?.posts);
      }
    });
  }

  function handleShowMore() {
    client.search(form).then((res) => {
      setPosts([]);
      setComments([]);

      if (activeSearchType.value === 'Comments') {
        setPosts([]);
        if (res?.comments.length < 10) {
          setHasMore(false);
        }
        if (comments && res?.comments)
          setComments([...comments, ...res?.comments]);
      }

      if (activeSearchType.value === 'Posts') {
        setComments([]);
        if (res?.posts.length < 10) {
          0;
          setHasMore(false);
        }
        if (posts && res?.posts) setPosts([...posts, ...res?.posts]);
      }
    });
  }

  // Gets list of communites from active lemmy instance
  function handleCommunityList() {
    const form: ListCommunities = {
      type_: activeListingType.value,
      sort: 'TopAll',
      page: currentCommunityPage,
    };

    client.listCommunities(form).then((res) => {
      if (res?.communities.length < 10) {
        setHasMoreCommunities(false);
      }
      setCommunityList(() =>
        currentCommunityPage === 1
          ? res?.communities
          : [...communityList, ...res?.communities],
      );
    });
  }

  // Searches for Communites, used in Query Field
  function handleSearchCommunities(searchQuery) {
    const form: Search = {
      q: searchQuery,
      type_: 'Communities',
      listing_type: activeListingType.value,
    };

    client.search(form).then((res) => {
      setCommunityList(res?.communities);
    });
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setLocationQuery(e.target.value);
  };

  /*
    useEffects
  */

  // Reset Query when location or location query is changed
  useEffect(() => {
    setComments([]);
    setPosts([]);
    setCurrentSearchResultPage(1);
    setHasMore(false);
  }, [
    activeAdministrativeRegion,
    activeGeographicIdentifier,
    activeSearchType,
    locationQuery,
  ]);

  // Reset when Lemmy Instance is changed
  useEffect(() => {
    setCommunityList(null);
    setActiveCommunity(null);
    setCurrentCommunityPage(1);
    setHasMoreCommunities(true);
    handleCommunityList();
  }, [activeLemmyInstance]);

  useEffect(() => {
    handleCommunityList();
  }, [currentCommunityPage]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleUpdate();
    }, 1312);
    return () => clearTimeout(debounce);
  }, [
    activeAdministrativeRegion,
    activeGeographicIdentifier,
    activeLemmyInstance,
    activeCommunity,
    activeListingType,
    activeSortType,
    activeSearchType,
    locationQuery,
  ]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleShowMore();
    }, 1312);
    return () => clearTimeout(debounce);
  }, [currentSearchResultPage]);

  return {
    posts,
    comments,
    communityList,
    setCurrentSearchResultPage,
    currentSearchResultPage,
    handleSearch,
    handleSearchQuery,
  };
}

export default useLemmy;
