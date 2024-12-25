import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// https://www.radix-ui.com/primitives/docs/components/hover-card
import * as HoverCard from '@radix-ui/react-hover-card';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import {
  LemmyHttp,
  GetCommunity,
  GetCommunityResponse,
  Community,
} from 'lemmy-js-client';

import LemmyUser from './User';
import { AtlasLemmyInstanceType } from '../../types/api.types';

interface CommunityInfoCardProps {
  children: React.ReactNode;
  lemmyInstance: AtlasLemmyInstanceType;
  community: Community;
}

function LemmyCommunityInfoCard({
  children,
  lemmyInstance,
  community,
}: CommunityInfoCardProps) {
  const {
    id,
    actor_id,
    name,
    icon,
    banner,
    description,
    nsfw,
    local,
    published,
    updated,
  } = community;

  const [communityDetails, setCommunityDetails] =
    useState<GetCommunityResponse>();

  const cakeDay = new Date(published).toDateString();
  const updateDay = new Date(updated ?? '1970-01-01').toDateString();

  function loadCommunityDetails() {
    const client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    const form: GetCommunity = {
      id: id,
    };
    client.getCommunity(form).then((res) => {
      setCommunityDetails(res);
    });
  }

  return (
    <HoverCard.Root
      openDelay={150}
      closeDelay={450}
      onOpenChange={loadCommunityDetails}
    >
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          // eslint-disable-next-line no-loss-of-precision
          collisionPadding={1.6180339887498948482 ^ 9}
          className={`community-info-card-content 
          ${nsfw && 'community-info-card-content-hightlighted'}`}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
            }}
          >
            {banner && <img className="banner-image" src={banner} alt={name} />}
            {icon && (
              <a
                className={`user-avatar-container user-avatar-infocard ${
                  banner && 'user-avatar-banner-offset'
                }`}
                href={actor_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="user-avatar-image"
                  src={icon}
                  alt={'Community Icon'}
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
                {local && (
                  <small className="user-mod">{lemmyInstance.baseUrl}</small>
                )}
                {nsfw && (
                  <small>
                    <p className="post-alert">NSFW</p>
                  </small>
                )}
                <h5 className="community-name">
                  <a href={actor_id} target="_blank" rel="noopener noreferrer">
                    <span className="prefix">c/</span>
                    {name}
                  </a>
                </h5>

                <div className="community-stats">
                  <p>
                    <b>
                      {communityDetails?.community_view.counts.subscribers.toLocaleString()}{' '}
                    </b>{' '}
                    <br />
                    <i>Subs</i>
                  </p>{' '}
                  <p>
                    <b>
                      {communityDetails?.community_view.counts.users_active_day.toLocaleString()}{' '}
                    </b>{' '}
                    <br />
                    <i>Daily</i>
                  </p>{' '}
                  <p>
                    <b>
                      {communityDetails?.community_view.counts.users_active_week.toLocaleString()}{' '}
                    </b>{' '}
                    <br />
                    <i>Weekly</i>
                  </p>{' '}
                  <p>
                    <b>
                      {communityDetails?.community_view.counts.users_active_month.toLocaleString()}{' '}
                    </b>{' '}
                    <br />
                    <i>Monthly</i>
                  </p>{' '}
                  <p>
                    <b>
                      {communityDetails?.community_view.counts.users_active_half_year.toLocaleString()}{' '}
                    </b>{' '}
                    <br />
                    <i>Half Year</i>
                  </p>
                </div>

                <small>🎂 {cakeDay}</small>
                {updated && (
                  <>
                    <br />
                    <small>🖊️ {updateDay}</small>
                  </>
                )}
              </div>
              {description && (
                <div className="user-bio">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              )}

              <div style={{ display: 'flex', gap: 15 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div>
                    {communityDetails?.community_view.counts.posts.toLocaleString()}
                  </div>
                  <div>Posts</div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div>
                    {communityDetails?.community_view.counts.comments.toLocaleString()}
                  </div>
                  <div>Comments</div>
                </div>
              </div>
              <div className="mod-wrapper">
                <small className="community-mod">Mods</small>
                <div className="mod-list">
                  {communityDetails?.moderators.map(
                    (communityModeratorView, index) => {
                      const { moderator } = communityModeratorView;
                      return (
                        <div
                          className="mod-user"
                          key={`${index}${moderator.id}${Math.random()}`}
                        >
                          <LemmyUser
                            person={moderator}
                            lemmyInstance={lemmyInstance}
                            showInfoCard={false}
                          />
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
          <HoverCard.Arrow className="user-info-card-arrow" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export default LemmyCommunityInfoCard;
