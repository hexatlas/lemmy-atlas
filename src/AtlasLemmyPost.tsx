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
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState(null);

  function handleReplies() {
    let client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    let form: GetComments = {
      parent_id: post?.id,
      max_depth: 1,
      sort: sort,
    };

    client.getComments(form).then((res) => {
      console.log(res);

      setReplies(res?.comments);
    });
  }
  console.log(post);

  return (
    <Collapsible.Root
      className={`community-post post-collapse-root ${
        (post?.post.featured_community || post?.post.featured_local) && "post-featured"
      }`}
      open={open}
      onOpenChange={setOpen}
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
            <div className="post-collapse-trigger">{open ? "⊟" : "⊞"}</div>
          </Collapsible.Trigger>
        </div>
        {/* Post Thumbnail */}
        <div className="post-thumbnail-container" tabIndex={0}>
          <img
            className="post-thumbnail-image"
            src={post?.post.thumbnail_url}
            alt={`Post Thumbnail`}
          />
        </div>
        <div>
          {/* OP Post */}
          {commentDepth < 1 && (
            <div>
              {post?.post.locked && <small className="post-pinned">🔒</small>}
              <a
                className="post-post"
                // href={post?.comment.ap_id}
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
        </div>
      </div>
      <Collapsible.Content>
        <>
          {/* Comment Body */}
          {post?.post?.removed && <p className="post-body">Comment removed.</p>}
          {post?.post?.deleted && <p className="post-body">Comment deleted.</p>}
          {!(post?.post?.removed || post?.post?.deleted) && (
            <ReactMarkdown className="post-body">{post?.post.body}</ReactMarkdown>
          )}

          {/* Replies */}
          <div
            className={`post-reply-container post-reply-depth-${(commentDepth % 7) + 1}`}
          >
            {/* Reply Count */}
            {post?.counts.child_count > 0 && !replies && (
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
                {`${post?.counts.child_count} repl${
                  post?.counts.child_count > 1 ? "ies" : "y"
                }`}
              </p>
            )}

            {/* Reply Comments */}
            {replies &&
              replies.map((reply, index) => {
                if (reply.comment.id == post?.comment.id) return; // filter parent commment from API response
                return (
                  <Comment
                    key={`${reply.creator.id}${reply.comment.id}${index}`}
                    community={community}
                    post={reply}
                    lemmyInstance={lemmyInstance}
                    commentDepth={commentDepth + 1}
                    sort={sort}
                    ratioDetector={post?.counts.score}
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
