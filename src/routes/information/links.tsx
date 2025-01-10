import React, { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../__root';
import LegendLayout from '../../components/shared/AtlasLegendLayout';

export const Route = createFileRoute('/information/links')({
  component: LinksRouteComponent,
});

function LinksRouteComponent() {
  const { activeGeographicIdentifier, activeAdministrativeRegion } =
    useContext(AtlasContext)!;

  return (
    <LegendLayout route={Route}>
      <h3>BannedThought.net</h3>
      <a
        href="http://bannedthought.net/RecentPostings.htm"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Recent Posts
      </a>
      <br />
      {activeAdministrativeRegion?.country != 'country' && (
        <a
          href={`http://bannedthought.net/${encodeURI(
            activeAdministrativeRegion[activeGeographicIdentifier] as string,
          ).replace(/%20/g, '-')}/index.htm`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Resources on{' '}
          {activeAdministrativeRegion[activeGeographicIdentifier]}
        </a>
      )}
      <h3>WorldAtlas.com</h3>
      {activeAdministrativeRegion?.country != 'country' && (
        <>
          <a
            href={`https://www.worldatlas.com/maps/${encodeURI(
              activeAdministrativeRegion[activeGeographicIdentifier] as string,
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
    </LegendLayout>
  );
}
