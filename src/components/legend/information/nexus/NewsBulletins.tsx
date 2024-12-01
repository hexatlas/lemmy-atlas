import React from 'react';
import ReactMarkdown from 'react-markdown';

import useNewsBulletins from '../../../../data/information/nexus/useNewsBulletins';
import NewsBulletinsHexBear from './NewsBulletinsHexBear';

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

export function NewsBulletins({
  activeAdministrativeRegion,
  activeLemmyInstance,
  activeCommunity,
  activeListingType,
  activeSortType,
}) {
  const { newsBulletinsPosts, isLoading } = useNewsBulletins(
    activeAdministrativeRegion,
  );

  return (
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

      {isLoading && <p className="search-loading-icon">🔍</p>}

      {newsBulletinsPosts && (
        <>
          <h3>{newsBulletinsPosts.title}</h3>
          <p> {newsBulletinsPosts.description}</p>
          <a
            href={newsBulletinsPosts.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 {newsBulletinsPosts.link}
          </a>
          {newsBulletinsPosts.items &&
            newsBulletinsPosts.items.map((bulletin, index) => {
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
                  <NewsBulletinsHexBear bulletin={bulletin} />
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}

export default NewsBulletins;
