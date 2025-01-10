import React from 'react';

import LemmyCommunityInfoCard from './CommunityInfoCard';
import { AtlasLemmyInstanceType } from '../../types/api.types';
import { CommentView, Community, PostView } from 'lemmy-js-client';

interface AtlasLemmyCommunityProps {
  view?: PostView | CommentView;
  community?: Community;
  lemmyInstance: AtlasLemmyInstanceType;
  showCommunityIcon?: boolean;
  prefix?: string;
}

function AtlasLemmyCommunity({
  view,
  community,
  lemmyInstance,
  showCommunityIcon = true,
  prefix = '➡️',
}: AtlasLemmyCommunityProps) {
  const { icon, name, actor_id } = view?.community || community!;

  return (
    <div className="community__wrapper">
      {prefix && <small className="post-to">{prefix}</small>}

      {showCommunityIcon && (
        <LemmyCommunityInfoCard
          lemmyInstance={lemmyInstance}
          community={view?.community || community!}
        >
          <div className="community__avatar-container" tabIndex={0}>
            <img className="community__avatar-image" src={icon} alt={name} />
          </div>
        </LemmyCommunityInfoCard>
      )}
      <a href={actor_id} target="_blank" rel="noopener noreferrer">
        <small>{name}</small>
      </a>
    </div>
  );
}

export default AtlasLemmyCommunity;
