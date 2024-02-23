import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { GetComments, LemmyHttp } from "lemmy-js-client";

import { TimeAgo } from "./hooks/useDataTransform";

import Comment from "./AtlasLemmyComment";
import LemmyUser from "./AtlasLemmyUser";
import LemmyCommunity from "./AtlasLemmyCommunity";

function Post({ post, community, lemmyInstance, sort, commentDepth = 0 }) {
  const [openPost, setOpenPost] = useState(false);
  const [replies, setReplies] = useState(null);

  function handleReplies() {
    let client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    console.log(post, "post | handleReplies");
    let form: GetComments = {
      post_id: post?.post.id,
      sort: sort,
      max_depth: 1,
      type_: "All",
      limit: 0,
    };
    client.getComments(form).then((res) => {
      setReplies(res?.comments);
    });
  }

  return (
    <Collapsible.Root
      className={`community-post post-collapse-root ${
        (post?.post.featured_community || post?.post.featured_local) && "post-featured"
      }`}
      open={openPost}
      onOpenChange={setOpenPost}
    >
      <div className="post-info-container">
        <div>
          {(post?.post.featured_community || post?.post.featured_local) && (
            <small className="post-pinned">📌</small>
          )}
          {/* Score Count / Upvotes / Downvotes */}
          <p className="post-vote-container">
            {Number(post?.counts.downvotes) === 0 || (
              <sup className={`post-vote post-vote-upvotes`}>{post?.counts.upvotes}</sup>
            )}
            <span
              className={`post-vote commment-vote-score post-score-${
                post?.counts.score > 0 ? "positive" : "negative"
              }`}
            >
              {post?.counts.score}
            </span>
            {Number(post?.counts.downvotes) === 0 || (
              <sub className={`post-vote post-vote-downvotes`}>
                {post?.counts.downvotes}
              </sub>
            )}
          </p>
          <Collapsible.Trigger>
            <div className="post-collapse-trigger">{openPost ? "⊟" : "⊞"}</div>
          </Collapsible.Trigger>
        </div>
        {/* Post Thumbnail */}
        <div className="post-thumbnail-container" tabIndex={0}>
          <img
            className="post-thumbnail-image"
            src={post?.post.thumbnail_url}
            alt={`💬`}
          />
        </div>
        <div className="post-meta">
          {/* OP Post */}
          {commentDepth < 1 && (
            <div>
              {post?.post.locked && <small className="post-pinned">🔒</small>}
              <a
                className="post-post"
                href={post?.post.ap_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <small>{post?.post.name}</small>
              </a>
            </div>
          )}

          <div className="post-info-wrapper">
            {/* User / Poster */}
            <LemmyUser
              post={post}
              lemmyInstance={lemmyInstance}
              community={community}
              sort={sort}
            />

            {/* COMMUNITY */}
            {commentDepth < 1 &&
              post?.community?.id != community?.counts?.community_id && (
                <LemmyCommunity
                  post={post}
                  sort={sort}
                  community={community}
                  lemmyInstance={lemmyInstance}
                />
              )}
            {/* Timestamp */}
            <small className="post-timestamp">
              <TimeAgo dateString={post?.post.published} />
            </small>
          </div>
          {/* Reply Count */}
          {post?.counts.comments > 0 && (
            <p className="comment-count">{`🧵 ${post?.counts.comments} `}</p>
          )}
        </div>
      </div>

      <Collapsible.Content>
        <>
          {/* Post Body */}
          {post?.post?.removed && <p className="post-body">🚮 Comment removed.</p>}
          {post?.post?.deleted && <p className="post-body">🗑️ Comment deleted.</p>}
          {!(post?.post?.removed || post?.post?.deleted) && post?.post.body && (
            <ReactMarkdown className="post-body">{post?.post.body}</ReactMarkdown>
          )}

          {/* Replies */}
          <div
            className={`post-reply-container post-reply-depth-${(commentDepth % 7) + 1}`}
          >
            {/* Reply Count */}
            {post?.counts.comments > 0 && !replies && (
              <p
                className="reply-button"
                role="button"
                tabIndex={0}
                aria-label="Show Replies"
                onClick={handleReplies}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Space") {
                    handleReplies;
                  }
                }}
              >
                <span className="post-replycount-icon">↪</span>
                {`${post?.counts.comments} comment${
                  post?.counts.comments > 1 ? "s" : ""
                }`}
              </p>
            )}

            {/* Reply Comments */}
            {replies &&
              replies.map((reply, index) => {
                return (
                  <Comment
                    key={`${reply.creator.id}${index}`}
                    community={community}
                    post={reply}
                    lemmyInstance={lemmyInstance}
                    commentDepth={commentDepth + 1}
                    sort={sort}
                    ratioDetector={reply?.counts.score}
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
