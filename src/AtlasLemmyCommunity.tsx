import LemmyCommunityInfoCard from "./AtlasLemmyCommunityInfoCard";

function AtlasLemmyCommunity({
  post,
  lemmyInstance,
  sort,
  community,
  showCommunityIcon = true,
}) {
  return (
    <>
      <small> to </small>

      {showCommunityIcon && (
        <LemmyCommunityInfoCard
          post={post}
          lemmyInstance={lemmyInstance}
          sort={sort}
          community={post?.community}
        >
          <div className="user-avatar-container" tabIndex={0}>
            <img
              className="user-avatar-image"
              src={post?.community?.icon}
              alt={
                (community?.display_name && community?.display_name[0]) ||
                community?.name[0]
              }
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
    </>
  );
}

export default AtlasLemmyCommunity;
