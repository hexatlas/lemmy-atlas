import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/hover-card
import * as HoverCard from "@radix-ui/react-hover-card";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { LemmyHttp, GetCommunity } from "lemmy-js-client";

import { userPronouns } from "./hooks/useDataTransform";

import LemmyUser from "./AtlasLemmyUser";
import Post from "./AtlasLemmyPost";

function AtlasLemmyCommunityInfoCard({ children, post, lemmyInstance, sort, community }) {
  const [communityDetails, setCommunityDetails] = useState(null);

  const cakeDay = new Date(community?.published).toDateString();
  const updateDay = new Date(community?.updated).toDateString();
  const pronounsArray = userPronouns(post?.creator?.display_name);

  function loadCommunityDetails() {
    let client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    let form: GetCommunity = {
      id: community?.id,
    };

    client.getCommunity(form).then((res) => {
      console.log(res, "loadCommunityDetails");

      setCommunityDetails(res);
    });
  }

  return (
    <HoverCard.Root openDelay={150} closeDelay={450} onOpenChange={loadCommunityDetails}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          collisionPadding={1.6180339887498948482 ^ 14}
          className={`community-info-card-content 
          ${community.nsfw && "community-info-card-content-hightlighted"}`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            {community?.banner && (
              <img
                className="banner-image"
                src={community?.banner}
                alt={community?.display_name || community?.name}
              />
            )}
            {community?.icon && (
              <a
                className={`user-avatar-container user-avatar-infocard ${
                  post?.creator?.banner && "user-avatar-banner-offset"
                }`}
                href={community?.actor_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="user-avatar-image"
                  src={community?.icon}
                  alt={post?.creator?.display_name || post?.creator?.name}
                />
              </a>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 15,
              }}
            >
              <div>
                {community.local && (
                  <small className="user-mod">{lemmyInstance.baseUrl}</small>
                )}
                {community.nsfw && (
                  <small>
                    <p className="post-alert">NSFW</p>
                  </small>
                )}

                <h5>{community?.name}</h5>

                <div className="community-stats">
                  <h6>
                    {communityDetails?.community_view.counts.subscribers.toLocaleString()}{" "}
                    Subs
                  </h6>{" "}
                  <h6>
                    {communityDetails?.community_view.counts.users_active_day.toLocaleString()}{" "}
                    Daily
                  </h6>{" "}
                  <h6>
                    {communityDetails?.community_view.counts.users_active_week.toLocaleString()}{" "}
                    Weekly
                  </h6>{" "}
                  <h6>
                    {communityDetails?.community_view.counts.users_active_month.toLocaleString()}{" "}
                    Monthly
                  </h6>{" "}
                  <h6>
                    {communityDetails?.community_view.counts.users_active_half_year.toLocaleString()}{" "}
                    Half Year
                  </h6>
                </div>

                <small>🎂 {cakeDay}</small>
                {post?.creator?.updated && (
                  <>
                    <br />
                    <small>🖊️ {updateDay}</small>
                  </>
                )}
              </div>
              {post?.creator?.bio && (
                <div className="user-bio">
                  <ReactMarkdown>{community?.description}</ReactMarkdown>
                </div>
              )}

              <div style={{ display: "flex", gap: 15 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <div>
                    {communityDetails?.community_view.counts.posts.toLocaleString()}
                  </div>
                  <div>Posts</div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <div>
                    {communityDetails?.community_view.counts.comments.toLocaleString()}
                  </div>
                  <div>Comments</div>
                </div>
              </div>
              <div className="mod-wrapper">
                <small className="community-mod">Mods</small>
                <div className="mod-list">
                  {communityDetails?.moderators.map((moderators, index) => {
                    const { moderator } = moderators;
                    return (
                      <div className="mod-user">
                        <LemmyUser
                          key={`${index}${moderators.id}`}
                          post={post}
                          community={community}
                          sort={sort}
                          id={moderator?.id}
                          actor_id={moderator?.actor_id}
                          avatar={moderator?.avatar}
                          display_name={moderator?.display_name}
                          banned={moderator?.banned}
                          name={moderator?.name}
                          lemmyInstance={lemmyInstance}
                          showInfoCard={false}
                        />
                      </div>
                    );
                  })}
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

export default AtlasLemmyCommunityInfoCard;
