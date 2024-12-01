import React, { useState } from 'react';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { Search, LemmyHttp, SortType, ListingType } from 'lemmy-js-client';

import Comment from '../fediverse/lemmy/Comment';
import Post from '../fediverse/lemmy/Post';

function NewsBulletinsHexBear({ bulletin }) {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const hexBear = {
    id: 0,
    label: 'hexbear.net',
    baseUrl: 'https://hexbear.net/',
    community_id: 6, // !news@hexbear.net
    default: true,
  };

  const sortType: { value: SortType; label: String } = {
    value: 'New',
    label: '🆕',
  };
  const listingType: { value: ListingType; label: String } = {
    value: 'Local',
    label: '🏠',
  };

  function getHexbear(bulletinURL) {
    const client: LemmyHttp = new LemmyHttp(hexBear?.baseUrl);
    const form: Search = {
      community_id: hexBear?.community_id,
      type_: 'All',
      listing_type: listingType.value,
      sort: sortType.value,
      q: bulletinURL,
      creator_id: 19956, // https://hexbear.net/u/SeventyTwoTrillion
    };

    client.search(form).then((res) => {
      setComments([]);
      setPosts([]);

      if (comments && res?.comments) setComments(res?.comments);
      if (posts && res?.posts) setPosts(res?.posts);
      setIsLoaded(true);
    });
  }

  return (
    <div className="feed-community">
      {!isLoaded && (
        <p
          className="reply-button"
          role="button"
          tabIndex={0}
          aria-label="Show Replies"
          onClick={() => getHexbear(bulletin.link)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
              () => getHexbear(bulletin.link);
            }
          }}
        >
          <span className="post-replycount-icon">💬</span> /c/news
        </p>
      )}
      {posts && (
        <div className="post-reply-container">
          {posts.length > 0 &&
            posts.map((post, index) => (
              <Post
                key={index}
                post={post}
                community={{ id: 6 }}
                lemmyInstance={hexBear}
                activeListingType={listingType}
                sort={sortType}
              />
            ))}
        </div>
      )}
      {comments &&
        comments.map((comment, index) => {
          return (
            <Comment
              key={index}
              community={{ id: 6 }}
              post={comment}
              lemmyInstance={hexBear}
              sort={sortType}
              ratioDetector={comment?.counts.score}
              isOpen={false}
            />
          );
        })}
    </div>
  );
}

export default NewsBulletinsHexBear;
