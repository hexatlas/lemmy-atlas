import LemmyCommunityInfoCard from "./AtlasLemmyCommunityInfoCard";

function AtlasLemmyCommunity({
  post,
  lemmyInstance,
  sort,
  community,
  showCommunityIcon = true,
  icon = post?.community?.icon,
  display_name = post?.community?.display_name,
  name = post?.community?.name,
  prefix = "to",
}) {
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
