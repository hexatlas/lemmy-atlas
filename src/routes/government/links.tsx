import React, { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../__root';
import LegendLayout from '../../components/shared/AtlasLegendLayout';

export const Route = createFileRoute('/government/links')({
  component: LinksRouteComponent,
});

function LinksRouteComponent() {
  const { activeAdministrativeRegion } = useContext(AtlasContext)!;

  return (
    <LegendLayout route={Route}>
      {activeAdministrativeRegion['region'] === 'Europe' && (
        <>
          <h3>🏛️ PolitPro: {activeAdministrativeRegion['country']} </h3>
          <a
            href={`https://politpro.eu/en/${activeAdministrativeRegion['country'].toLowerCase()}`}
            target="_blank"
            rel="noreferrer"
          >
            Election Trend
          </a>
          <br />
          <a
            href={`https://politpro.eu/en/${activeAdministrativeRegion['country'].toLowerCase()}/coalitions`}
            target="_blank"
            rel="noreferrer"
          >
            Possible coalitions
          </a>
          <br />
          <a
            href={`https://politpro.eu/en/${activeAdministrativeRegion['country'].toLowerCase()}/parties`}
            target="_blank"
            rel="noreferrer"
          >
            Political parties at a glance
          </a>
          <br />
          <a
            href={`https://politpro.eu/en/${activeAdministrativeRegion['country'].toLowerCase()}/parties`}
            target="_blank"
            rel="noreferrer"
          >
            Positions in comparison
          </a>
          <br />
          <a
            href={`https://politpro.eu/en/${activeAdministrativeRegion['country'].toLowerCase()}/polls`}
            target="_blank"
            rel="noreferrer"
          >
            Latest Polls
          </a>
        </>
      )}
    </LegendLayout>
  );
}
