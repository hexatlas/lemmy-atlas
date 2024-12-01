import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// https://www.radix-ui.com/primitives/docs/components/hover-card
import * as HoverCard from '@radix-ui/react-hover-card';

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { LemmyHttp, GetPersonDetails } from 'lemmy-js-client';
import LemmyCommunity from './Community';
import Post from './Post';
import Comment from './Comment';
import { listingTypes } from '../../../../../AtlasConfig';
import { userPronouns } from '../../../../../hooks/useDataTransform';

function AtlasLemmyUserInfoCard({
  children,
  post,
  lemmyInstance,
  sort,
  community,
}) {
  const [user, setUser] = useState(null);
  const [activeUserTab, setActiveUserTab] = useState('Comments');

  const cakeDay = new Date(post.creator.published).toDateString();
  const updateDay = new Date(post?.creator?.updated).toDateString();
  const pronounsArray = userPronouns(post?.creator?.display_name);

  function loadUserDetails() {
    const client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    const form: GetPersonDetails = {
      person_id: post?.creator.id,
    };

    client.getPersonDetails(form).then((res) => {
      setUser(res);
    });
  }

  return (
    <HoverCard.Root
      openDelay={150}
      closeDelay={450}
      onOpenChange={loadUserDetails}
    >
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          collisionPadding={1.6180339887498948482 ^ 9}
          className={`user-info-card-content ${
            (post?.creator_is_admin || post?.creator_is_moderator) &&
            'user-info-card-content-hightlighted'
          }`}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
            }}
          >
            {post?.creator?.banner && (
              <img
                className="banner-image"
                src={post?.creator?.banner}
                alt={post?.creator?.display_name || post?.creator?.name}
              />
            )}
            {post?.creator?.avatar && (
              <a
                className={`user-avatar-container user-avatar-infocard ${
                  post?.creator?.banner && 'user-avatar-banner-offset'
                }`}
                href={post?.creator?.actor_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="user-avatar-image"
                  src={post?.creator?.avatar}
                  alt={post?.creator?.display_name || post?.creator?.name}
                />
              </a>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 15,
              }}
            >
              <div>
                {post?.creator_is_admin && (
                  <small className="user-mod">Admin</small>
                )}
                {post?.creator_is_moderator && (
                  <small className="user-mod">Mod</small>
                )}
                {post?.creator?.banned && (
                  <small>
                    <a
                      href={`${lemmyInstance.baseUrl}modlog?page=1&userId=${post?.creator?.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="post-alert"
                    >
                      Banned
                    </a>
                  </small>
                )}

                {post?.creator?.banned ? (
                  <h5
                    style={{
                      textDecoration: 'line-through',
                    }}
                  >
                    <span className="prefix">u/</span>
                    {post?.creator?.name}
                  </h5>
                ) : (
                  <h5>
                    <span className="prefix">u/</span>
                    {post?.creator?.name}
                  </h5>
                )}

                <div className="user-pronouns">
                  {pronounsArray &&
                    pronounsArray.map((pronoun, index) => (
                      <p key={index}>{pronoun}</p>
                    ))}
                </div>
                <small>🎂 {cakeDay}</small>
                {post?.creator?.updated && (
                  <>
                    <br />
                    <small>🖊️ {updateDay}</small>
                  </>
                )}
              </div>

              <Tabs.Root
                className="user-card-tabs"
                value={activeUserTab}
                onValueChange={setActiveUserTab}
              >
                <Tabs.List className="tabs-list" aria-label="Pick User Info">
                  {post?.creator?.bio && (
                    <Tabs.Trigger className="tabs-trigger" value="Bio">
                      Bio
                    </Tabs.Trigger>
                  )}
                  {user?.moderates.length > 0 && (
                    <Tabs.Trigger className="tabs-trigger" value="Mods">
                      Mods
                    </Tabs.Trigger>
                  )}
                  {user?.posts.length > 0 && (
                    <Tabs.Trigger className="tabs-trigger" value="Posts">
                      {user?.person_view?.counts?.post_count.toLocaleString()}{' '}
                      Posts
                    </Tabs.Trigger>
                  )}

                  {user?.comments.length > 0 && (
                    <Tabs.Trigger className="tabs-trigger" value="Comments">
                      {user?.person_view?.counts?.comment_count.toLocaleString()}{' '}
                      Comments
                    </Tabs.Trigger>
                  )}
                </Tabs.List>
                {post?.creator?.bio && (
                  <Tabs.Content value="Bio" className="tabs-content">
                    <div className="user-bio">
                      <ReactMarkdown>{post?.creator?.bio}</ReactMarkdown>
                    </div>
                  </Tabs.Content>
                )}
                {user?.moderates.length > 0 && (
                  <Tabs.Content value="Mods" className="tabs-content">
                    <div className="mod-wrapper">
                      <small className="community-mod">Mods</small>
                      <div className="mod-list">
                        {user?.moderates.map((community, index) => {
                          return (
                            <div
                              className="mod-user"
                              key={`${index}${community.id}`}
                            >
                              <LemmyCommunity
                                post={community}
                                lemmyInstance={lemmyInstance}
                                sort={sort}
                                // community={community}
                                icon={community?.icon}
                                display_name={community?.display_name}
                                name={community?.name}
                                prefix={null}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Tabs.Content>
                )}
                <Tabs.Content value="Posts" className="tabs-content">
                  <div className="user-posts">
                    {user?.posts.length > 0 &&
                      user?.posts.map((post, index) => (
                        <Post
                          key={`${post?.id}${index}`}
                          post={post}
                          community={community}
                          lemmyInstance={lemmyInstance}
                          sort={sort}
                          activeListingType={listingTypes}
                        ></Post>
                      ))}
                  </div>
                </Tabs.Content>
                <Tabs.Content value="Comments" className="tabs-content">
                  <div className="user-posts">
                    {user?.comments.length > 0 &&
                      user?.comments.map((comment, index) => (
                        <Comment
                          key={`${comment?.id}${index}`}
                          post={comment}
                          community={community}
                          lemmyInstance={lemmyInstance}
                          sort={sort}
                          ratioDetector={undefined}
                          showUserAvatar={false}
                        ></Comment>
                      ))}
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>

          <HoverCard.Arrow className="user-info-card-arrow" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export default AtlasLemmyUserInfoCard;
