import React from 'react';

import LemmyCommunityInfoCard from './CommunityInfoCard';
import {
  AtlasLemmyInstanceType,
  AtlasLemmySortType,
} from '../../types/api.types';
import { PostView } from 'lemmy-js-client';

interface AtlasLemmyCommunityProps {
  post: PostView;
  lemmyInstance: AtlasLemmyInstanceType; // Replace with the actual type if different
  sort: AtlasLemmySortType;
  showCommunityIcon?: boolean;
  icon?: string;
  display_name?: string;
  name?: string;
  prefix?: string;
}

function AtlasLemmyCommunity({
  post,
  lemmyInstance,
  sort,
  // community,
  showCommunityIcon = true,
  icon = post?.community?.icon,
  display_name = post?.community?.display_name,
  name = post?.community?.name,
  prefix = 'to',
}: AtlasLemmyCommunityProps) {
  return (
    <div className="community-wrapper">
      {prefix && <small className="post-to">{prefix}</small>}

      {showCommunityIcon && (
        <LemmyCommunityInfoCard
          lemmyInstance={lemmyInstance}
          sort={sort}
          community={post?.community}
        >
          <div className="community-avatar-container" tabIndex={0}>
            <img
              className="community-avatar-image"
              src={icon}
              alt={(display_name && display_name[0]) || name[0]}
            />
          </div>
        </LemmyCommunityInfoCard>
      )}
      <a
        href={post?.community?.actor_id}
        // className="community-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <small>{post?.community?.name}</small>
      </a>
    </div>
  );
}

export default AtlasLemmyCommunity;
