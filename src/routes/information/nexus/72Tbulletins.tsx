import React, { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../../__root';
import useNewsBulletins from '../../../data/information/nexus/useNewsBulletins';
import ReactMarkdown from 'react-markdown';
import HexBear from '../../../components/shared/HexBear';

export const Route = createFileRoute('/information/nexus/72Tbulletins')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activeAdministrativeRegion } = useContext(AtlasContext);

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

      {isLoading && <p className="search-loading-emoji">🔍</p>}

      {newsBulletinsPosts && (
        <>
          <h3>{newsBulletinsPosts.title}</h3>
          <p> {newsBulletinsPosts.description}</p>
          <a
            href={newsBulletinsPosts.link as string}
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
                    🗓️ {new Date(bulletin.pubDate as string).toDateString()}
                  </p>
                  <a
                    className="feed-link"
                    href={bulletin.link as string}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗 {bulletin.title}
                  </a>
                  <ReactMarkdown>{`📰 ${bulletin.description}`}</ReactMarkdown>
                  <HexBear query={bulletin.link as string}>c/news</HexBear>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}
