import React, { useContext, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { CommentView, GetComments, LemmyHttp, PostView } from 'lemmy-js-client';

import { TimeAgo } from '../../hooks/useDataTransform';

import Comment from './Comment';
import LemmyUser from './User';
import LemmyCommunity from './Community';
import {
  AtlasLemmyCommentSortType,
  AtlasLemmyInstanceType,
} from '../../types/api.types';
import { InformationContext } from '../../routes/information';

interface PostProps {
  postView: PostView;
  lemmyInstance: AtlasLemmyInstanceType;
  commentSort?: AtlasLemmyCommentSortType;
  commentDepth?: number;
  isOpen?: boolean;
}

function Post({
  postView,
  lemmyInstance,
  commentSort,
  commentDepth = 0,
  isOpen = false,
}: PostProps) {
  const [openPost, setOpenPost] = useState(isOpen);
  const [replies, setReplies] = useState<CommentView[]>([]);

  const { activeCommunity, activeListingType } =
    useContext(InformationContext)!;

  function handleReplies() {
    const client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    const form: GetComments = {
      post_id: postView.post.id,
      sort: commentSort?.value,
      max_depth: 1,
      type_: activeListingType.value,
      limit: 0,
    };
    client.getComments(form).then((res) => {
      setReplies(res?.comments);
    });
  }

  return (
    <Collapsible.Root
      className={`community-post post-collapse-root ${
        (postView?.post.featured_community || postView?.post.featured_local) &&
        'post-featured'
      }`}
      open={openPost}
      onOpenChange={setOpenPost}
    >
      <div className="post-info-container">
        <div>
          {(postView?.post.featured_community ||
            postView?.post.featured_local) && (
            <small className="post-pinned">📌</small>
          )}
          {/* Score Count / Upvotes / Downvotes */}
          <p className="post-vote-container">
            {Number(postView?.counts.downvotes) === 0 || (
              <p className={`post-vote post-vote-upvotes`}>
                {postView?.counts.upvotes}
              </p>
            )}
            <span
              className={`post-vote commment-vote-score post-score-${
                postView?.counts.score > 0 ? 'positive' : 'negative'
              }`}
            >
              {postView?.counts.score}
            </span>
            {Number(postView?.counts.downvotes) === 0 || (
              <p className={`post-vote post-vote-downvotes`}>
                {postView?.counts.downvotes}
              </p>
            )}
          </p>
        </div>
        {/* Post Thumbnail */}
        <Collapsible.Trigger
          className="post-thumbnail-container"
          tabIndex={0}
          onClick={() => setOpenPost(!openPost)}
          aria-label="Expand Post"
        >
          <img
            className="post-thumbnail-image"
            src={postView?.post.thumbnail_url}
            alt={`🪧`}
          />
        </Collapsible.Trigger>
        <div className="post-meta">
          {/* OP Post */}
          {commentDepth < 1 && (
            <div>
              {postView?.post.locked && (
                <small className="post-pinned">🔒</small>
              )}
              <a
                className="post-post"
                href={postView?.post.ap_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <small>{postView?.post.name}</small>
              </a>
            </div>
          )}

          <div className="post-info-wrapper">
            {/* User / Poster */}
            <LemmyUser view={postView} lemmyInstance={lemmyInstance} />

            {/* COMMUNITY */}
            {commentDepth < 1 &&
              postView?.community?.id !=
                activeCommunity?.counts?.community_id && (
                <LemmyCommunity
                  view={postView}
                  lemmyInstance={lemmyInstance as AtlasLemmyInstanceType}
                />
              )}
            {/* Timestamp */}
            <small className="post-timestamp">
              <TimeAgo dateString={postView?.post.published} />
            </small>
          </div>
          {/* Reply Count */}
          {postView?.counts.comments > 0 && (
            <p className="comment-count">{`💬 ${postView?.counts.comments}`}</p>
          )}
        </div>
      </div>

      <Collapsible.Content>
        <>
          {postView?.post.url && (
            <a
              href={postView?.post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="post-url"
            >
              🔗 {postView?.post.url}
            </a>
          )}

          {postView?.post.thumbnail_url && (
            <button
              className="post-image-container"
              tabIndex={0}
              onClick={() => setOpenPost(!openPost)}
              aria-label="Expand Post"
            >
              <img
                className="post-image"
                src={postView?.post.thumbnail_url}
                alt={`🧵`}
              />
            </button>
          )}

          {/* Post Body */}
          {postView?.post?.removed && (
            <p className="post-body">🚮 Comment removed.</p>
          )}
          {postView?.post?.deleted && (
            <p className="post-body">🗑️ Comment deleted.</p>
          )}
          {!(postView?.post?.removed || postView?.post?.deleted) &&
            postView?.post.body && (
              <ReactMarkdown className="post-body">
                {postView?.post.body}
              </ReactMarkdown>
            )}

          {/* Replies */}
          <div
            className={`post-reply-container post-reply-depth-${(commentDepth % 7) + 1}`}
          >
            {/* Reply Count */}
            {postView?.counts.comments > 0 && replies.length === 0 && (
              <p
                className="reply-button"
                role="button"
                tabIndex={0}
                aria-label="Show Replies"
                onClick={handleReplies}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Space') {
                    handleReplies();
                  }
                }}
              >
                <span className="post-replycount-emoji">💬</span>
                {`${postView?.counts.comments} comment${
                  postView?.counts.comments > 1 ? 's' : ''
                }`}
              </p>
            )}

            {/* Reply Comments */}
            {replies &&
              replies.map((commentView, index) => {
                const { counts, creator } = commentView;

                return (
                  <Comment
                    key={`${creator.id}${index}`}
                    commentView={commentView}
                    lemmyInstance={lemmyInstance as AtlasLemmyInstanceType}
                    commentDepth={commentDepth + 1}
                    commentSort={commentSort}
                    ratioDetector={counts.score}
                  />
                );
              })}
          </div>
        </>
      </Collapsible.Content>

      <hr />
    </Collapsible.Root>
  );
}

export default Post;
