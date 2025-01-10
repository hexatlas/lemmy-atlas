import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// https://www.radix-ui.com/primitives/docs/components/hover-card
import * as HoverCard from '@radix-ui/react-hover-card';

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import {
  LemmyHttp,
  GetPersonDetails,
  GetPersonDetailsResponse,
  PostView,
  Person,
  CommentView,
} from 'lemmy-js-client';
import LemmyCommunity from './Community';
import Post from './Post';
import Comment from './Comment';
import { AtlasLemmyInstanceType } from '../../types/api.types';
import { userPronouns } from '../../hooks/useDataTransform';

interface AtlasLemmyUserInfoCardProps {
  children: React.ReactNode;
  person: Person;
  view: PostView | CommentView;
  lemmyInstance: AtlasLemmyInstanceType;
}

function AtlasLemmyUserInfoCard({
  children,
  person,
  view,
  lemmyInstance,
}: AtlasLemmyUserInfoCardProps) {
  const {
    id,
    actor_id,
    display_name,
    name,
    banner,
    avatar,
    bio,
    published,
    updated,
    banned,
  } = person;

  const { creator_is_admin, creator_is_moderator } = view;

  const [user, setUser] = useState<GetPersonDetailsResponse>();
  const [activeUserTab, setActiveUserTab] = useState('Comments');

  const cakeDay = new Date(published).toDateString();
  const updateDay = new Date(updated as string).toDateString();
  const pronounsArray = userPronouns(display_name);

  function loadUserDetails() {
    const client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    const form: GetPersonDetails = {
      person_id: id,
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
          // eslint-disable-next-line no-loss-of-precision
          collisionPadding={1.6180339887498948482 ^ 9}
          className={`user__info-card-content ${
            (creator_is_admin || creator_is_moderator) &&
            'user__info-card-content-hightlighted'
          }`}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
            }}
          >
            {banner && (
              <img
                className="banner-image"
                src={banner}
                alt={display_name || name}
              />
            )}
            {avatar && (
              <a
                className={`user__avatar user__avatar-infocard ${
                  banner && 'user__avatar-banner-offset'
                }`}
                href={actor_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="user__avatar--image"
                  src={avatar}
                  alt={display_name || name}
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
                {creator_is_admin && <small className="user__mod">Admin</small>}
                {creator_is_moderator && (
                  <small className="user__mod">Mod</small>
                )}
                {banned && (
                  <small>
                    <a
                      href={`${lemmyInstance.baseUrl}modlog?page=1&userId=${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="comment__alert"
                    >
                      Banned
                    </a>
                  </small>
                )}

                {banned ? (
                  <h5
                    style={{
                      textDecoration: 'line-through',
                    }}
                  >
                    <span className="prefix">u/</span>
                    {name}
                  </h5>
                ) : (
                  <h5>
                    <span className="prefix">u/</span>
                    {name}
                  </h5>
                )}

                <div className="user__pronouns">
                  {pronounsArray &&
                    pronounsArray.map((pronoun, index) => (
                      <p key={index}>{pronoun}</p>
                    ))}
                </div>
                <small>🎂 {cakeDay}</small>
                {updated && (
                  <>
                    <br />
                    <small>🖊️ {updateDay}</small>
                  </>
                )}
              </div>

              <Tabs.Root
                className="user__card-tabs"
                value={activeUserTab}
                onValueChange={setActiveUserTab}
              >
                <Tabs.List className="tabs__list" aria-label="Pick User Info">
                  {bio && (
                    <Tabs.Trigger className="tabs__trigger" value="Bio">
                      Bio
                    </Tabs.Trigger>
                  )}
                  {user?.moderates && user?.moderates.length > 0 && (
                    <Tabs.Trigger className="tabs__trigger" value="Mods">
                      Mods
                    </Tabs.Trigger>
                  )}
                  {user?.posts && user?.posts.length > 0 && (
                    <Tabs.Trigger className="tabs__trigger" value="Posts">
                      {user?.person_view?.counts?.post_count.toLocaleString()}{' '}
                      Posts
                    </Tabs.Trigger>
                  )}

                  {user?.comments && user?.comments.length > 0 && (
                    <Tabs.Trigger className="tabs__trigger" value="Comments">
                      {user?.person_view?.counts?.comment_count.toLocaleString()}{' '}
                      Comments
                    </Tabs.Trigger>
                  )}
                </Tabs.List>
                {bio && (
                  <Tabs.Content value="Bio" className="tabs__content">
                    <div className="user__bio">
                      <ReactMarkdown>{bio}</ReactMarkdown>
                    </div>
                  </Tabs.Content>
                )}
                {user?.moderates && user?.moderates.length > 0 && (
                  <Tabs.Content value="Mods" className="tabs__content">
                    <div className="mod-wrapper">
                      <small className="community__mod">Mods</small>
                      <div className="mod-list">
                        {user?.moderates.map(
                          (communityModeratorView, index) => {
                            const { community } = communityModeratorView;
                            return (
                              <div
                                className="mod-user"
                                key={`${index}${community.id}`}
                              >
                                <LemmyCommunity
                                  community={community}
                                  lemmyInstance={lemmyInstance}
                                  prefix={''}
                                />
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </Tabs.Content>
                )}
                <Tabs.Content value="Posts" className="tabs__content">
                  <div className="user__posts">
                    {user?.posts &&
                      user?.posts.length > 0 &&
                      user?.posts.map((postView, index) => {
                        const { post } = postView;
                        return (
                          <Post
                            key={`${post?.id}${index}`}
                            postView={postView}
                            lemmyInstance={lemmyInstance}
                          ></Post>
                        );
                      })}
                  </div>
                </Tabs.Content>
                <Tabs.Content value="Comments" className="tabs__content">
                  <div className="user__posts">
                    {user?.comments &&
                      user?.comments.length > 0 &&
                      user?.comments.map((commentView, index) => {
                        const { comment } = commentView;
                        return (
                          <Comment
                            key={`${comment?.id}${index}`}
                            commentView={commentView}
                            lemmyInstance={lemmyInstance}
                            ratioDetector={99}
                            showUserAvatar={false}
                          ></Comment>
                        );
                      })}
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>

          <HoverCard.Arrow className="user__info-card-arrow" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export default AtlasLemmyUserInfoCard;
