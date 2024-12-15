import React, { useContext } from 'react';
import Post from '../lemmy/Post';
import Comment from '../lemmy/Comment';
import { InformationContext } from '../../routes/information';
import useHexbear from '../../data/shared/useHexbear';

function HexBear({
  children = <>Search on hexbear.net</>,
  query,
}: {
  children;
  query: string;
}) {
  const {
    activeLemmyInstance,
    activeCommunity,
    activeListingType,
    activeSortType,
  } = useContext(InformationContext);

  const { comments, posts, isLoaded, fetchHexBear } = useHexbear(
    query,
    activeLemmyInstance,
    activeCommunity,
  );

  return (
    <div className="feed-community">
      {!isLoaded && (
        <p
          className="reply-button"
          role="button"
          tabIndex={0}
          aria-label="Show Replies"
          onClick={fetchHexBear}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchHexBear();
            }
          }}
        >
          <span className="post-replycount-emoji">💬</span> {children}
        </p>
      )}
      {posts.length > 0 && (
        <div className="post-reply-container">
          {posts.length > 0 &&
            posts.map((post, index) => (
              <Post
                key={index}
                post={post}
                community={activeCommunity}
                lemmyInstance={activeLemmyInstance}
                activeListingType={activeListingType}
                sort={activeSortType}
              />
            ))}
        </div>
      )}
      {comments &&
        comments.length > 0 &&
        comments.map((comment, index) => {
          return (
            <Comment
              key={index}
              community={activeCommunity}
              post={comment}
              lemmyInstance={activeLemmyInstance}
              sort={activeSortType}
              ratioDetector={comment?.counts.score}
              isOpen={false}
            />
          );
        })}
    </div>
  );
}

export default HexBear;
