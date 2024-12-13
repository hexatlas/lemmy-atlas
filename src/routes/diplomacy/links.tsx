import * as React from 'react';
import { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../__root';

export const Route = createFileRoute('/diplomacy/links')({
  component: LinksRouteComponent,
});

function LinksRouteComponent() {
  const { activeGeographicIdentifier, activeAdministrativeRegion } =
    useContext(AtlasContext);

  return (
    <div id="legend-content">
      <h3>🕊️ {activeAdministrativeRegion[activeGeographicIdentifier]} LINKS</h3>
    </div>
  );
}
