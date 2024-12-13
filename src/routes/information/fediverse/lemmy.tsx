import React, { useContext, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { InformationContext } from '../../information';
import { AtlasContext } from '../../__root';
import useLemmy from '../../../data/information/fediverse/useLemmy';
import Comment from '../../../components/lemmy/Comment';
import Post from '../../../components/lemmy/Post';
import LemmyCommunityInfoCard from '../../../components/lemmy/CommunityInfoCard';

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

import { searchTypes } from '../../../types/api.types';

export const Route = createFileRoute('/information/fediverse/lemmy')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    sideBarRef,

    // Location
    activeGeographicIdentifier,
    activeAdministrativeRegion,
    locationQuery,
    setLocationQuery,
  } = useContext(AtlasContext);
  const {
    // Community
    defaultInstance,
    activeLemmyInstance,
    setActiveLemmyInstance,

    activeCommunity,
    setActiveCommunity,

    activeSearchType,
    setActiveSearchType,

    listingTypes,
    activeListingType,
    setActiveListingType,

    sortTypes,
    activeSortType,
    setActiveSortType,
  } = useContext(InformationContext);
  const [editLemmyInstance, setEditLemmyInstance] = useState(false);

  const {
    posts,
    comments,
    communityList,
    setCurrentSearchResultPage,
    currentSearchResultPage,
    handleSearch,
    handleSearchQuery,
  } = useLemmy(
    // Util
    sideBarRef,

    // Location
    activeGeographicIdentifier,
    activeAdministrativeRegion,
    locationQuery,
    setLocationQuery,

    // Community
    activeLemmyInstance,

    activeCommunity,
    setActiveCommunity,

    activeSearchType,
    activeListingType,

    activeSortType,
  );
  return (
    <>
      <div id="legend-content" className="legend-content-container">
        {editLemmyInstance ? (
          <div className="search-input-wrapper">
            <button
              role="button"
              title="Reset Lemmy to Hexbear"
              aria-label="Reset Lemmy to Hexbear"
              className="atlas-reset-button"
              onClick={() => {
                setActiveLemmyInstance(defaultInstance);
              }}
            >
              {activeLemmyInstance.baseUrl} ⨯
            </button>

            <div className="search-form">
              <label htmlFor="search-input" className="sr-only">
                Paste Lemmy URL
              </label>
              <input
                name="search-input"
                type="text"
                className="search-input"
                aria-label="Paste Lemmy URL"
                placeholder="Paste Lemmy URL"
                onPaste={(e) => {
                  e.preventDefault();
                  setActiveLemmyInstance({
                    id: 1,
                    label: 'UserDefined',
                    baseUrl:
                      e.clipboardData.getData('Text') || 'https://hexbear.net/',
                    community_id: null,
                    default: false,
                  });
                  setEditLemmyInstance(!editLemmyInstance);
                }}
              />
              {/* <button type="submit"></button> */}
            </div>
          </div>
        ) : (
          <div className="lemmy-edit-instance">
            <button
              role="button"
              title="Change Lemmy Instance"
              aria-label="Change Lemmy Instance"
              onClick={() => setEditLemmyInstance(!editLemmyInstance)}
            >
              🔻
            </button>
            <a
              href={activeLemmyInstance.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{activeLemmyInstance.baseUrl}</span>
            </a>
          </div>
        )}
        {activeCommunity && activeCommunity?.community?.banner && (
          <LemmyCommunityInfoCard
            lemmyInstance={activeLemmyInstance}
            community={activeCommunity?.community}
            sort={activeSortType}
          >
            <img
              className="banner-image"
              src={activeCommunity?.community?.banner}
              alt={`${activeCommunity?.community?.name} Community Banner`}
            />
          </LemmyCommunityInfoCard>
        )}
        <div className="search-input-wrapper">
          {activeCommunity?.community && (
            <LemmyCommunityInfoCard
              lemmyInstance={activeLemmyInstance}
              community={activeCommunity?.community}
              sort={activeSortType}
            >
              <button
                role="button"
                title="Reset Atlas to default settings"
                aria-label="Styled Reset Atlas Settings to default settings"
                className="atlas-reset-button"
                onClick={() => setActiveCommunity(null)}
              >
                <span className="prefix">c/</span>
                {activeCommunity &&
                  activeCommunity?.community?.name} ⨯
              </button>
            </LemmyCommunityInfoCard>
          )}
          <div className="search-form">
            <label htmlFor="search-input" className="sr-only">
              Query Selected Location
            </label>
            <input
              name="search-input"
              type="text"
              className="search-input"
              aria-label="Query Selected Community about Region"
              placeholder={`Query ${activeAdministrativeRegion.country !== 'country' ? activeAdministrativeRegion[activeGeographicIdentifier] : ''}`}
              value={locationQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="community-list">
          {communityList &&
            communityList.map((community) => {
              return (
                <button
                  key={community?.counts?.community_id}
                  className={`community-button ${
                    community?.counts?.community_id ===
                      activeCommunity?.counts?.community_id &&
                    'community-button-active'
                  }`}
                  role="button"
                  aria-label={`${community?.community?.name} community filter`}
                  onClick={() => {
                    if (activeCommunity === community) {
                      setActiveCommunity(null);
                    } else {
                      setActiveCommunity(community);
                    }
                  }}
                >
                  {community?.community?.name}
                </button>
              );
            })}
        </div>
        <div className="lemmy-settings">
          <Tabs.Root
            value={activeSearchType}
            onValueChange={setActiveSearchType}
          >
            <Tabs.List
              className="lemmy-setting-container"
              aria-label="Select SearchType"
            >
              {searchTypes.map((searchType, index) => (
                <Tabs.Trigger
                  key={index}
                  value={searchType as unknown as string}
                  className="lemmy-setting"
                >
                  {searchType.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          <Tabs.Root
            value={activeListingType}
            onValueChange={setActiveListingType}
          >
            <Tabs.List
              className="lemmy-setting-container"
              aria-label="Select ListingType"
            >
              {listingTypes.map((listingType, index) => (
                <Tabs.Trigger
                  key={index}
                  value={listingType as unknown as string}
                  className="lemmy-setting"
                >
                  {listingType.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          <Tabs.Root value={activeSortType} onValueChange={setActiveSortType}>
            <Tabs.List
              className="lemmy-setting-container"
              aria-label="Select SortType"
            >
              {sortTypes.map((sortType, index) => (
                <Tabs.Trigger
                  key={index}
                  value={sortType as unknown as string}
                  className="lemmy-setting"
                >
                  {sortType.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        </div>
        {comments && activeSearchType.value === 'Comments' && (
          <div className="post-reply-container">
            {comments.length > 0 &&
              comments.map(
                (comment, index) =>
                  comment?.comment?.removed ||
                  comment?.comment?.deleted || (
                    <Comment
                      key={`${comment?.comment.id}${index * Math.random()}`}
                      post={comment}
                      community={activeCommunity}
                      lemmyInstance={activeLemmyInstance}
                      sort={activeSortType}
                      ratioDetector={undefined}
                    />
                  ),
              )}
          </div>
        )}
        {posts && activeSearchType.value === 'Posts' && (
          <div className="post-reply-container">
            {posts.length > 0 &&
              posts.map((post, index) => (
                <Post
                  key={`${post?.post.id}${index * Math.random()}`}
                  post={post}
                  community={activeCommunity}
                  lemmyInstance={activeLemmyInstance}
                  activeListingType={activeListingType}
                  sort={activeSortType}
                />
              ))}
          </div>
        )}
        <button
          className="view-more"
          onClick={() =>
            setCurrentSearchResultPage(currentSearchResultPage + 1)
          }
        >
          View More
        </button>
      </div>
      <div className="legend-footer">
        <a
          href={encodeURI(
            `${activeLemmyInstance.baseUrl}search?q=${encodeURIComponent(
              handleSearchQuery(),
            )}&type=${activeSearchType.value}&listingType=${
              activeListingType.value
            }&communityId=${
              activeCommunity?.counts?.community_id
            }&page=${currentSearchResultPage}&sort=${activeSortType.value}`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 view in {activeLemmyInstance.baseUrl}
        </a>
      </div>
    </>
  );
}
