import React, { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../__root';
import LegendLayout from '../../components/shared/AtlasLegendLayout';

export const Route = createFileRoute('/government/links')({
  component: LinksRouteComponent,
});

function LinksRouteComponent() {
  const { activeGeographicIdentifier, activeAdministrativeRegion } =
    useContext(AtlasContext)!;

  return (
    <LegendLayout route={Route}>
      <h3>🏛️ {activeAdministrativeRegion[activeGeographicIdentifier]} LINKS</h3>
    </LegendLayout>
  );
}
