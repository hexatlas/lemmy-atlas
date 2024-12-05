import React from 'react';

export function AtlasMisc({
  activeGeographicIdentifier,
  activeAdministrativeRegion,
}) {
  return (
    <div id="legend-content">
      <h3>BannedThought.net</h3>
      <a
        href="http://bannedthought.net/RecentPostings.htm"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Recent Posts
      </a>
      <br />
      {activeAdministrativeRegion.country != 'country' && (
        <a
          href={`http://bannedthought.net/${encodeURI(
            activeAdministrativeRegion[activeGeographicIdentifier],
          ).replace(/%20/g, '-')}/index.htm`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Resources on{' '}
          {activeAdministrativeRegion[activeGeographicIdentifier]}
        </a>
      )}
      <h3>WorldAtlas.com</h3>
      {activeAdministrativeRegion.country != 'country' && (
        <>
          <a
            href={`https://www.worldatlas.com/maps/${encodeURI(
              activeAdministrativeRegion[activeGeographicIdentifier],
            )
              .replace(/%20/g, '-')
              .toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 World Atlas on{' '}
            {activeAdministrativeRegion[activeGeographicIdentifier]}
          </a>
        </>
      )}
    </div>
  );
}

export default AtlasMisc;
