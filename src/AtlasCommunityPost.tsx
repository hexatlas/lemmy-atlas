import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { GetComments, LemmyHttp } from "lemmy-js-client";

import { TimeAgo, userPronouns } from "./hooks/useDataTransform";

import Comment from "./AtlasCommunityComment";
import AtlasCommunityUserInfoCard from "./AtlasCommunityUserInfoCard";

function Post({ post }, community, lemmyInstance, sort, commentDepth = 0) {
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState(null);
  const pronounsArray = userPronouns(post?.creator?.display_name);

  function handleReplies() {
    let client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    let form: GetComments = {
      parent_id: post?.post.id,
      max_depth: 1,
      sort: sort,
    };

    client.getComments(form).then((res) => {
      console.log(res);

      setReplies(res?.comments);
    });
  }

  // useEffect(() => {
  //   console.log(replies, "replies", "POST - Comment replies");
  // }, [replies]);

  return (
    <Collapsible.Root
      className={`community-post post-collapse-root ${
        (post?.featured_community || post?.featured_local) && "post-highlight"
      }`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="post-info-container">
        <div>
          {" "}
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
            src={post?.post?.thumbnail_url}
            alt={`Post Thumbnail`}
          />
        </div>
        <div>
          {/* OP Post */}
          {commentDepth < 1 && (
            <a
              className="post-post"
              // href={post?.comment.ap_id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>{post?.post?.name}</small>
            </a>
          )}

          <div className="post-info-wrapper">
            {/* User / Poster */}
            <a
              className="post-creator"
              href={post?.creator?.actor_id}
              target="_blank"
              rel="noopener noreferrer"
            >
              {post?.creator?.name}
            </a>
            <div className="user-pronouns">
              {pronounsArray &&
                pronounsArray.map((pronoun, index) => <p key={index}>{pronoun}</p>)}
            </div>
            {commentDepth < 1 &&
              post?.community?.id != community?.counts?.community_id && (
                <>
                  <small> to </small>
                  <a
                    href={post?.community?.actor_id}
                    // className="community-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <small>{post?.community?.name}</small>
                  </a>
                </>
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
          <ReactMarkdown className="post-body">{post?.post.body}</ReactMarkdown>

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
