import React from 'react';

import { userPronouns } from '../../hooks/useDataTransform';
import LemmyUserInfoCard from './UserInfoCard';
import { CommentView, Person, PostView } from 'lemmy-js-client';
import {
  AtlasLemmyInstanceType,
  AtlasLemmySortType,
} from '../../types/api.types';

interface AtlasLemmyUserProps {
  view?: PostView | CommentView;
  person?: Person;
  lemmyInstance: AtlasLemmyInstanceType;
  showInfoCard?: boolean;
}

function AtlasLemmyUser({
  view,
  person,
  lemmyInstance,
  showInfoCard = true,
}: AtlasLemmyUserProps) {
  const { avatar, name, display_name, actor_id } = view?.creator || person!;

  const pronounsArray = userPronouns(display_name);

  return (
    <div className="user-wrapper">
      {showInfoCard ? (
        <LemmyUserInfoCard
          view={view!}
          lemmyInstance={lemmyInstance}
          person={view?.creator || person!}
        >
          <div className="user-avatar-container" tabIndex={0}>
            <img
              className="user-avatar-image"
              src={avatar}
              alt={(display_name && display_name[0]) || name[0]}
            />
          </div>
        </LemmyUserInfoCard>
      ) : (
        <div className="user-avatar-container" tabIndex={0}>
          <img
            className="user-avatar-image"
            src={avatar}
            alt={(display_name && display_name[0]) || name[0]}
          />
        </div>
      )}
      {/* User / Poster */}
      <a
        className="post-creator"
        href={actor_id}
        target="_blank"
        rel="noopener noreferrer"
      >
        {name}
      </a>
      <div className="user-pronouns">
        {pronounsArray &&
          pronounsArray.map((pronoun, index) => <p key={index}>{pronoun}</p>)}
      </div>
    </div>
  );
}

export default AtlasLemmyUser;
