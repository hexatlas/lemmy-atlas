import React from 'react';

import useWiki from '../../../../data/information/nexus/useWiki';

export function Wiki({
  wikiURL,
  isProleWiki = false,
  activeLocationType,
  activeAdministrativeRegion,
}) {
  const { wikiData, isLoading } = useWiki(
    activeAdministrativeRegion,
    activeLocationType,
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
                  activeAdministrativeRegion[activeLocationType],
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeAdministrativeRegion[activeLocationType]} on {wikiURL}
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
                  activeAdministrativeRegion[activeLocationType],
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeAdministrativeRegion[activeLocationType]} on {wikiURL}
              </a>
            </p>
          </>
        )}
        <hr />
        <br />
        {isLoading && <p className="search-loading-icon">🔍</p>}
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
            activeAdministrativeRegion[activeLocationType],
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

export default Wiki;
