import React, { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../../__root';
import useWiki from '../../../data/information/nexus/useWiki';

export const Route = createFileRoute('/information/nexus/natopedia')({
  component: RouteComponent,
});

function RouteComponent() {
  const { activeGeographicIdentifier, activeAdministrativeRegion } =
    useContext(AtlasContext);

  const wikiURL = 'https://en.wikipedia.org/w';
  const isProleWiki = false;

  const { wikiData, isLoading } = useWiki(
    activeAdministrativeRegion,
    activeGeographicIdentifier,
    wikiURL,
    isProleWiki,
  );

  return (
    <>
      <div id="legend-content">
        {isProleWiki ? (
          <>
            <p>
              Please consider contributing knowledge on{' '}
              <a
                href={`https://en.prolewiki.org/?search=${encodeURI(
                  activeAdministrativeRegion[activeGeographicIdentifier],
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeAdministrativeRegion[activeGeographicIdentifier]} on{' '}
                {wikiURL}
              </a>
            </p>

            <a
              href={`https://en.prolewiki.org/wiki/Category:Library_works_about_${encodeURI(
                activeAdministrativeRegion.country,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📚📕 All library works about {activeAdministrativeRegion.country}{' '}
              on ProleWiki.
            </a>
          </>
        ) : (
          <>
            <p>
              Please consider correcting information on{' '}
              <a
                href={`${wikiURL}?search=${encodeURI(
                  activeAdministrativeRegion[activeGeographicIdentifier],
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeAdministrativeRegion[activeGeographicIdentifier]} on{' '}
                {wikiURL}
              </a>
            </p>
          </>
        )}
        <hr />
        <br />
        {isLoading && <p className="search-loading-emoji">🔍</p>}
        {wikiData && (
          <>
            <h3>{wikiData.title}</h3>
            <div
              className="prolewiki"
              dangerouslySetInnerHTML={{ __html: wikiData?.text['*'] }}
            ></div>
          </>
        )}
      </div>
      <div className="legend-footer">
        <a
          href={`${wikiURL}?search=${encodeURI(
            activeAdministrativeRegion[activeGeographicIdentifier],
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View more on {wikiURL}
        </a>
      </div>
    </>
  );
}
