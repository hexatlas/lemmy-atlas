import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/hover-card
import * as HoverCard from "@radix-ui/react-hover-card";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { LemmyHttp, GetPersonDetails } from "lemmy-js-client";

import { userPronouns } from "../../../hooks/useDataTransform";

import Comment from "./AtlasLemmyComment";
import LemmyCommunity from "./AtlasLemmyCommunity";

/*
 /$$   /$$                                                                  
| $$  | $$                                                                  
| $$  | $$  /$$$$$$$  /$$$$$$   /$$$$$$                                     
| $$  | $$ /$$_____/ /$$__  $$ /$$__  $$                                    
| $$  | $$|  $$$$$$ | $$$$$$$$| $$  \__/                                    
| $$  | $$ \____  $$| $$_____/| $$                                          
|  $$$$$$/ /$$$$$$$/|  $$$$$$$| $$                                          
 \______/ |_______/  \_______/|__/                                          
                                                                            
                                                                            
                                                                            
 /$$$$$$            /$$$$$$           /$$$$$$                            /$$
|_  $$_/           /$$__  $$         /$$__  $$                          | $$
  | $$   /$$$$$$$ | $$  \__//$$$$$$ | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$$
  | $$  | $$__  $$| $$$$   /$$__  $$| $$       |____  $$ /$$__  $$ /$$__  $$
  | $$  | $$  \ $$| $$_/  | $$  \ $$| $$        /$$$$$$$| $$  \__/| $$  | $$
  | $$  | $$  | $$| $$    | $$  | $$| $$    $$ /$$__  $$| $$      | $$  | $$
 /$$$$$$| $$  | $$| $$    |  $$$$$$/|  $$$$$$/|  $$$$$$$| $$      |  $$$$$$$
|______/|__/  |__/|__/     \______/  \______/  \_______/|__/       \_______/
                                                                            
                                                                            
                                                                            
*/

function AtlasLemmyUserInfoCard({ children, post, lemmyInstance, sort, community }) {
  const [user, setUser] = useState(null);

  const cakeDay = new Date(post.creator.published).toDateString();
  const updateDay = new Date(post?.creator?.updated).toDateString();
  const pronounsArray = userPronouns(post?.creator?.display_name);

  function loadUserDetails() {
    let client: LemmyHttp = new LemmyHttp(lemmyInstance?.baseUrl);

    let form: GetPersonDetails = {
      person_id: post?.creator.id,
    };

    client.getPersonDetails(form).then((res) => {
      setUser(res);
    });
  }

  return (
    <HoverCard.Root openDelay={150} closeDelay={450} onOpenChange={loadUserDetails}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          collisionPadding={1.6180339887498948482 ^ 14}
          className={`user-info-card-content ${
            (post?.creator_is_admin || post?.creator_is_moderator) &&
            "user-info-card-content-hightlighted"
          }`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
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
                  post?.creator?.banner && "user-avatar-banner-offset"
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
                display: "flex",
                flexDirection: "column",
                gap: 15,
              }}
            >
              <div>
                {post?.creator_is_admin && <small className="user-mod">Admin</small>}
                {post?.creator_is_moderator && <small className="user-mod">Mod</small>}
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
                      textDecoration: "line-through",
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
                    pronounsArray.map((pronoun, index) => <p key={index}>{pronoun}</p>)}
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
                  <ReactMarkdown>{post?.creator?.bio}</ReactMarkdown>
                </div>
              )}
              {user?.moderates.length > 0 && (
                <div className="mod-wrapper">
                  <small className="community-mod">Mods</small>
                  <div className="mod-list">
                    {user?.moderates.map((community, index) => {
                      return (
                        <div className="mod-user">
                          <LemmyCommunity
                            key={`${index}${community.id}`}
                            post={community}
                            lemmyInstance={lemmyInstance}
                            sort={sort}
                            community={community}
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
              )}

              <div style={{ display: "flex", gap: 15 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <div>{user?.person_view?.counts?.post_count.toLocaleString()}</div>{" "}
                  <div>Posts</div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <div>{user?.person_view?.counts?.comment_count.toLocaleString()}</div>
                  <div>Comments</div>
                </div>
              </div>

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
            </div>
          </div>

          <HoverCard.Arrow className="user-info-card-arrow" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export default AtlasLemmyUserInfoCard;
