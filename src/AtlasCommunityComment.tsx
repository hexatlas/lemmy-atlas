import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { GetComments, LemmyHttp } from "lemmy-js-client";

import { TimeAgo, userPronouns } from "./hooks/useDataTransform";
import AtlasCommunityUserInfoCard from "./AtlasCommunityUserInfoCard";

function Comment({
  post,
  community,
  lemmyInstance,
  sort,
  ratioDetector,
  commentDepth = 0,
}) {
  const [open, setOpen] = useState(true);
  const [replies, setReplies] = useState(null);
  const pronounsArray = userPronouns(post?.creator?.display_name);

  function handleReplies() {
    let client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    let form: GetComments = {
      parent_id: post?.comment.id,
      max_depth: 1,
      sort: sort,
    };

    client.getComments(form).then((res) => {
      setReplies(res?.comments);
    });
  }

  useEffect(() => {
    if (post?.comment?.deleted) setOpen(false);
  }, [post?.comment?.deleted]);

  return (
    <Collapsible.Root
      className={`community-post comment-collapse-root ${
        post?.counts.score > ratioDetector && "comment-ratio-active"
      }`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="comment-info-container">
        <Collapsible.Trigger>
          <div className="comment-collapse-trigger">{open ? "⊟" : "⊞"}</div>
        </Collapsible.Trigger>

        {/* AVATAR PROFILE PICTURE */}
        <AtlasCommunityUserInfoCard
          post={post}
          lemmyInstance={lemmyInstance}
          community={community}
          sort={sort}
        >
          <div className="user-avatar-container" tabIndex={0}>
            <img
              className="user-avatar-image"
              src={post?.creator?.avatar}
              alt={
                (post?.creator?.display_name && post?.creator?.display_name[0]) ||
                post?.creator?.name[0]
              }
            />
          </div>
        </AtlasCommunityUserInfoCard>

        {/* User / Poster */}
        <a
          className="comment-creator"
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
        {post?.creator?.banned && (
          <a
            href={`${lemmyInstance.baseUrl}modlog?page=1&userId=${post?.creator?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="comment-nsfw"
          >
            Banned
          </a>
        )}

        {/* {post?.comment.distinguished && (
          <p className="comment-mod">Distinguished</p>
        )} */}

        {/* Score Count / Upvotes / Downvotes */}
        <p className="comment-vote-container">
          {Number(post?.counts.downvotes) === 0 || (
            <sup className={`comment-vote comment-vote-upvotes`}>
              {post?.counts.upvotes}
            </sup>
          )}
          <span
            className={`comment-vote commment-vote-score comment-score-${
              post?.counts.score > 0 ? "positive" : "negative"
            }`}
          >
            {post?.counts.score}
          </span>
          {Number(post?.counts.downvotes) === 0 || (
            <sub className={`comment-vote comment-vote-downvotes`}>
              {post?.counts.downvotes}
            </sub>
          )}
        </p>

        {/* Timestamp */}
        <small className="comment-timestamp">
          <TimeAgo dateString={post?.comment.published} />
        </small>
      </div>
      <Collapsible.Content>
        <>
          {/* OP Post */}
          {commentDepth < 1 && (
            <a
              className="comment-post"
              href={post?.comment.ap_id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>{post?.post?.name}</small>
            </a>
          )}

          {commentDepth < 1 && post?.community?.id != community?.counts?.community_id && (
            <>
              <small> in </small>
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
          {commentDepth < 1 && (post?.post?.nsfw || post?.community?.nsfw) && (
            <p className="comment-nsfw">NSFW</p>
          )}

          {/* Comment Body */}
          <ReactMarkdown className="comment-body">{post?.comment.content}</ReactMarkdown>

          {/* Replies */}
          <div
            className={`comment-reply-container comment-reply-depth-${
              (commentDepth % 7) + 1
            }`}
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
                <span className="comment-replycount-icon">↪</span>
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

export default Comment;
