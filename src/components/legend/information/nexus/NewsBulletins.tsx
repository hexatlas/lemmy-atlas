import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { Search, LemmyHttp } from 'lemmy-js-client';

import Comment from '../fediverse/lemmy/Comment';
import Post from '../fediverse/lemmy/Post';
import { useStateStorage } from '../../../../hooks/useAtlasUtils';
import { useQuery } from '@tanstack/react-query';

/*
 /$$$$$$$$ /$$$$$$  /$$$$$$$$                                           
|_____ $$//$$__  $$|__  $$__/                                           
     /$$/|__/  \ $$   | $$  /$$$$$$$                                    
    /$$/   /$$$$$$/   | $$ /$$_____/                                    
   /$$/   /$$____/    | $$|  $$$$$$                                     
  /$$/   | $$         | $$ \____  $$                                    
 /$$/    | $$$$$$$$   | $$ /$$$$$$$/                                    
|__/     |________/   |__/|_______/                                     
                                                                        
                                                                        
                                                                        
 /$$$$$$$            /$$ /$$             /$$     /$$                    
| $$__  $$          | $$| $$            | $$    |__/                    
| $$  \ $$ /$$   /$$| $$| $$  /$$$$$$  /$$$$$$   /$$ /$$$$$$$   /$$$$$$$
| $$$$$$$ | $$  | $$| $$| $$ /$$__  $$|_  $$_/  | $$| $$__  $$ /$$_____/
| $$__  $$| $$  | $$| $$| $$| $$$$$$$$  | $$    | $$| $$  \ $$|  $$$$$$ 
| $$  \ $$| $$  | $$| $$| $$| $$_____/  | $$ /$$| $$| $$  | $$ \____  $$
| $$$$$$$/|  $$$$$$/| $$| $$|  $$$$$$$  |  $$$$/| $$| $$  | $$ /$$$$$$$/
|_______/  \______/ |__/|__/ \_______/   \___/  |__/|__/  |__/|_______/ 
                                                                        
                                                                        
                                                                                                                                               
*/

export function AtlasNexusReadingList({
  // Location
  map,
  setMap,

  isOpenAtlasMapInterface,
  setIsOpenAtlasMapInterface,

  isLocationSelectMode,
  setIsLocationSelectMode,

  activeLocationSelection,
  setActiveLocationSelection,

  nominatim,
  setNominatim,

  regionTypes,
  activeLocationType,
  setActiveLocationType,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,

  // Community
  lemmyInstances,
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
}) {
  const fetchBulletinsRSS = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const xmlString = await response.text(); // Retrieve response as text

      const parser = new DOMParser();
      const xmlData = parser.parseFromString(xmlString, 'text/xml');

      const items = Array.from(xmlData.getElementsByTagName('item')).map(
        (item) => ({
          title: item.querySelector('title').textContent,
          link: item.querySelector('link').textContent,
          pubDate: item.querySelector('pubDate').textContent,
          description: item.querySelector('description').textContent,
        }),
      );

      const parsedData = {
        title: xmlData.querySelector('title').textContent,
        link: xmlData.querySelector('link').textContent,
        description: xmlData.querySelector('description').textContent,
        generator: xmlData.querySelector('generator').textContent,
        language: xmlData.querySelector('language').textContent,
        lastBuildDate: xmlData.querySelector('lastBuildDate').textContent,
        items: items,
      };

      return parsedData;
    } catch (error) {
      console.log(error);
    }
  };

  function HexBearNews({ bulletin }) {
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    function getHexbear(bulletinURL) {
      const client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);
      const form: Search = {
        community_id: activeCommunity?.counts?.community_id,
        type_: 'All',
        listing_type: 'All',
        sort: activeSortType.value,
        q: bulletinURL,
        creator_id: 19956, // https://hexbear.net/u/SeventyTwoTrillion
      };

      client.search(form).then((res) => {
        setComments([]);
        setPosts([]);

        if (comments && res?.comments) setComments(res?.comments);
        if (posts && res?.posts) setPosts(res?.posts);
        setIsLoaded(true);
      });
    }

    return (
      <div className="feed-community">
        {!isLoaded && (
          <p
            className="reply-button"
            role="button"
            tabIndex={0}
            aria-label="Show Replies"
            onClick={() => getHexbear(bulletin.link)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                () => getHexbear(bulletin.link);
              }
            }}
          >
            <span className="post-replycount-icon">💬</span> /c/news
          </p>
        )}
        {posts && (
          <div className="post-reply-container">
            {posts.length > 0 &&
              posts.map((post, index) => (
                <Post
                  key={index}
                  post={post}
                  community={{ id: 6 }}
                  lemmyInstance={activeLemmyInstance}
                  activeListingType={activeListingType}
                  sort={activeSortType}
                />
              ))}
          </div>
        )}
        {comments &&
          comments.map((comment, index) => {
            return (
              <Comment
                key={index}
                community={{ id: 6 }}
                post={comment}
                lemmyInstance={activeLemmyInstance}
                sort={activeSortType}
                ratioDetector={comment?.counts.score}
                isOpen={false}
              />
            );
          })}
      </div>
    );
  }

  let apiUrl = null;

  if (activeAdministrativeRegion.country !== 'country') {
    apiUrl = `/.netlify/functions/72T_bulletins/?country=${encodeURI(
      activeAdministrativeRegion.country,
    )
      .toLowerCase()
      .replace(/%20/g, '-')}`;
  } else {
    apiUrl = `/.netlify/functions/72T_bulletins/?index=true`;
  }

  const { data, isLoading } = useQuery({
    queryKey: [`NB-${activeAdministrativeRegion['alpha-2']}`],
    queryFn: () => fetchBulletinsRSS(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return (
    <>
      <div id="legend-content" className="legend-content-container">
        <h3>Reading List</h3>
        <a
          href={`https://bulletins.hexbear.net/posts/readinglist/#${encodeURI(
            activeAdministrativeRegion.country,
          )
            .toLowerCase()
            .replace(/%20/g, '-')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📚📕 Hexbear Reading List:
          {activeAdministrativeRegion.country != 'country' &&
            activeAdministrativeRegion.country}
        </a>

        {data && (
          <>
            <h3>{data.title}</h3>
            <p> {data.description}</p>
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              🔗 {data.link}
            </a>
            {data.items &&
              data.items.map((bulletin, index) => {
                return (
                  <div className="feed-item" key={index}>
                    <p className="feed-publish-date highlight">
                      🗓️ {new Date(bulletin.pubDate).toDateString()}
                    </p>
                    <a
                      className="feed-link"
                      href={bulletin.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 {bulletin.title}
                    </a>
                    <ReactMarkdown>{`📰 ${bulletin.description}`}</ReactMarkdown>
                    <HexBearNews bulletin={bulletin} />
                  </div>
                );
              })}
          </>
        )}
      </div>
    </>
  );
}

export default AtlasNexusReadingList;
