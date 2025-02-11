import { useState } from 'react';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { CommentView, LemmyHttp, PostView, Search } from 'lemmy-js-client';

function useHexbear(query: string, activeLemmyInstance, activeCommunity) {
  const [comments, setComments] = useState<CommentView[]>([]);
  const [posts, setPosts] = useState<PostView[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  function fetchHexBear() {
    const client: LemmyHttp = new LemmyHttp(activeLemmyInstance.baseUrl);
    const form: Search = {
      community_id: activeCommunity?.counts?.community_id,
      type_: 'All',
      listing_type: 'All',
      sort: 'TopAll',
      q: query,
      page: 1,
    };

    client.search(form).then((res) => {
      setComments([]);
      setPosts([]);

      if (comments && res?.comments) setComments(res?.comments);
      if (posts && res?.posts) setPosts(res?.posts);
      setIsLoaded(true);
    });
  }

  return { comments, posts, isLoaded, fetchHexBear };
}

export default useHexbear;
