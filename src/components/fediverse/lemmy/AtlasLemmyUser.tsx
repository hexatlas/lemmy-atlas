import { userPronouns } from "../../../hooks/useDataTransform";
import LemmyUserInfoCard from "./AtlasLemmyUserInfoCard";

/*
 /$$   /$$                              
| $$  | $$                              
| $$  | $$  /$$$$$$$  /$$$$$$   /$$$$$$ 
| $$  | $$ /$$_____/ /$$__  $$ /$$__  $$
| $$  | $$|  $$$$$$ | $$$$$$$$| $$  \__/
| $$  | $$ \____  $$| $$_____/| $$      
|  $$$$$$/ /$$$$$$$/|  $$$$$$$| $$      
 \______/ |_______/  \_______/|__/      
                                        
                                        
                                        
*/

function AtlasLemmyUser({
  post,
  lemmyInstance,
  community,
  sort,
  id = post?.creator?.id,
  actor_id = post?.creator?.actor_id,
  avatar = post?.creator?.avatar,
  display_name = post?.creator?.display_name,
  banned = post?.creator?.banned,
  name = post?.creator?.name,
  showInfoCard = true,
}) {
  const pronounsArray = userPronouns(display_name);
  return (
    <div className="user-wrapper">
      {showInfoCard ? (
        <LemmyUserInfoCard
          post={post}
          lemmyInstance={lemmyInstance}
          community={community}
          sort={sort}
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
