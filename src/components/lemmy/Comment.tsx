import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { GetComments, LemmyHttp } from 'lemmy-js-client';

import { TimeAgo } from '../../hooks/useDataTransform';
import LemmyUser from './User';
import LemmyCommunity from './Community';

/*

  /$$$$$$                                                              /$$    
 /$$__  $$                                                            | $$    
| $$  \__/  /$$$$$$  /$$$$$$/$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$  /$$$$$$  
| $$       /$$__  $$| $$_  $$_  $$| $$_  $$_  $$ /$$__  $$| $$__  $$|_  $$_/  
| $$      | $$  \ $$| $$ \ $$ \ $$| $$ \ $$ \ $$| $$$$$$$$| $$  \ $$  | $$    
| $$    $$| $$  | $$| $$ | $$ | $$| $$ | $$ | $$| $$_____/| $$  | $$  | $$ /$$
|  $$$$$$/|  $$$$$$/| $$ | $$ | $$| $$ | $$ | $$|  $$$$$$$| $$  | $$  |  $$$$/
 \______/  \______/ |__/ |__/ |__/|__/ |__/ |__/ \_______/|__/  |__/   \___/  
                                                                              
                                                                              
                                                                              
*/

function Comment({
  post,
  community,
  lemmyInstance,
  sort,
  ratioDetector,
  commentDepth = 0,
  showUserAvatar = true,
  isOpen = true,
}) {
  const [open, setOpen] = useState(isOpen);
  const [replies, setReplies] = useState(null);

  function handleReplies() {
    const client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    const form: GetComments = {
      parent_id: post?.comment.id,
      max_depth: 1,
      sort: sort.value,
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
      className={`community-reply post-collapse-root ${
        post?.counts.score > ratioDetector && 'post-highlight'
      }`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="comment-info-container">
        <Collapsible.Trigger>
          <div className="post-collapse-trigger">{open ? '⊟' : '⊞'}</div>
        </Collapsible.Trigger>
        {/* AVATAR PROFILE PICTURE */}

        <LemmyUser
          post={post}
          lemmyInstance={lemmyInstance}
          community={community}
          sort={sort}
          showInfoCard={showUserAvatar}
        />

        {post?.comment.distinguished && <p className="post-alert">📌</p>}

        {/* Score Count / Upvotes / Downvotes */}
        <p className="post-vote-container">
          {Number(post?.counts.downvotes) === 0 || (
            <sup className={`post-vote post-vote-upvotes`}>
              {post?.counts.upvotes}
            </sup>
          )}
          <span
            className={`post-vote commment-vote-score post-score-${
              post?.counts.score > 0 ? 'positive' : 'negative'
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

        {/* Timestamp */}
        <small className="post-timestamp">
          <TimeAgo dateString={post?.comment.published} />
        </small>
      </div>
      <Collapsible.Content>
        <>
          {/* OP Post */}
          {commentDepth < 1 && (
            <a
              className="post-post"
              href={post?.comment.ap_id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>{post?.post?.name}</small>
            </a>
          )}

          {commentDepth < 1 &&
            post?.community?.id != community?.counts?.community_id && (
              <LemmyCommunity
                post={post}
                sort={sort}
                // community={community}
                lemmyInstance={lemmyInstance}
                showCommunityIcon={community?.id != post?.community?.id}
              />
            )}
          {commentDepth < 1 && (post?.post?.nsfw || post?.community?.nsfw) && (
            <p className="post-alert">NSFW</p>
          )}

          {/* Comment Body */}
          {post?.comment?.removed && (
            <p className="comment-body">🚮 Comment removed.</p>
          )}
          {post?.comment?.deleted && (
            <p className="comment-body">🗑️ Comment deleted.</p>
          )}
          {!(post?.comment?.removed || post?.comment?.deleted) &&
            post?.comment.content && (
              <ReactMarkdown className="comment-body">
                {post?.comment.content}
              </ReactMarkdown>
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
                  if (e.key === 'Enter' || e.key === 'Space') {
                    handleReplies;
                  }
                }}
              >
                <span className="post-replycount-emoji">💬</span>
                {`${post?.counts.child_count} repl${
                  post?.counts.child_count > 1 ? 'ies' : 'y'
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
