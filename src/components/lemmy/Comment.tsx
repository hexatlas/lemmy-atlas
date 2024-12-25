import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { CommentView, GetComments, LemmyHttp } from 'lemmy-js-client';

import { TimeAgo } from '../../hooks/useDataTransform';
import LemmyUser from './User';
import LemmyCommunity from './Community';
import {
  AtlasLemmyCommentSortType,
  AtlasLemmyInstanceType,
} from '../../types/api.types';
import { InformationContext } from '../../routes/information';

interface CommentProps {
  commentView: CommentView;
  lemmyInstance: AtlasLemmyInstanceType;
  commentSort?: AtlasLemmyCommentSortType;
  ratioDetector: number;
  commentDepth?: number;
  showUserAvatar?: boolean;
  isOpen?: boolean;
}

function Comment({
  commentView,
  lemmyInstance,
  commentSort = { value: 'New', label: '🆕' },
  ratioDetector, // takes votecount of parent comment
  commentDepth = 0, // 0 = rootlevel / toplevel comment
  showUserAvatar = true,
  isOpen = true,
}: CommentProps) {
  const [open, setOpen] = useState(isOpen);
  const [replies, setReplies] = useState<CommentView[]>();

  const { activeCommunity } = useContext(InformationContext)!;

  function handleReplies() {
    const client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    const form: GetComments = {
      parent_id: commentView?.comment.id,
      max_depth: 1,
      sort: commentSort.value,
    };

    client.getComments(form).then((res) => {
      setReplies(res?.comments);
    });
  }

  useEffect(() => {
    if (commentView?.comment?.deleted) setOpen(false);
  }, [commentView?.comment?.deleted]);

  return (
    <Collapsible.Root
      className={`community-reply post-collapse-root ${
        commentView?.counts.score > ratioDetector && 'post-highlight'
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
          view={commentView}
          lemmyInstance={lemmyInstance}
          showInfoCard={showUserAvatar}
        />

        {commentView?.comment.distinguished && <p className="post-alert">📌</p>}

        {/* Score Count / Upvotes / Downvotes */}
        <p className="post-vote-container">
          {Number(commentView?.counts.downvotes) === 0 || (
            <sup className={`post-vote post-vote-upvotes`}>
              {commentView?.counts.upvotes}
            </sup>
          )}
          <span
            className={`post-vote commment-vote-score post-score-${
              commentView?.counts.score > 0 ? 'positive' : 'negative'
            }`}
          >
            {commentView?.counts.score}
          </span>
          {Number(commentView?.counts.downvotes) === 0 || (
            <sub className={`post-vote post-vote-downvotes`}>
              {commentView?.counts.downvotes}
            </sub>
          )}
        </p>

        {/* Timestamp */}
        <small className="post-timestamp">
          <TimeAgo dateString={commentView?.comment.published} />
        </small>
      </div>
      <Collapsible.Content>
        <>
          {/* OP Post */}
          {commentDepth < 1 && (
            <a
              className="post-post"
              href={commentView?.comment.ap_id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>{commentView?.post?.name}</small>
            </a>
          )}

          {commentDepth < 1 &&
            activeCommunity?.id != commentView?.community?.id && (
              <LemmyCommunity
                view={commentView}
                lemmyInstance={lemmyInstance}
                showCommunityIcon={
                  activeCommunity?.id != commentView?.community?.id
                }
              />
            )}
          {commentDepth < 1 &&
            (commentView?.post?.nsfw || commentView?.community?.nsfw) && (
              <p className="post-alert">NSFW</p>
            )}

          {/* Comment Body */}
          {commentView?.comment?.removed && (
            <p className="comment-body">🚮 Comment removed.</p>
          )}
          {commentView?.comment?.deleted && (
            <p className="comment-body">🗑️ Comment deleted.</p>
          )}
          {!(commentView?.comment?.removed || commentView?.comment?.deleted) &&
            commentView?.comment.content && (
              <ReactMarkdown className="comment-body">
                {commentView?.comment.content}
              </ReactMarkdown>
            )}

          {/* Replies */}
          <div
            className={`post-reply-container post-reply-depth-${(commentDepth % 7) + 1}`}
          >
            {/* Reply Count */}
            {commentView?.counts.child_count > 0 && !replies && (
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
                {`${commentView?.counts.child_count} repl${
                  commentView?.counts.child_count > 1 ? 'ies' : 'y'
                }`}
              </p>
            )}

            {/* Reply Comments */}
            {replies &&
              replies.map((reply, index) => {
                const { comment, creator } = reply;
                if (comment.id == commentView?.comment.id) return; // filter parent commment from API response
                return (
                  <Comment
                    key={`${creator.id}${comment.id}${index}`}
                    commentView={reply}
                    lemmyInstance={lemmyInstance}
                    commentDepth={commentDepth + 1}
                    ratioDetector={commentView?.counts.score}
                    commentSort={commentSort}
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
