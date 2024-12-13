import * as React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/diplomacy/map')({
  component: MapRouteComponent,
});

function MapRouteComponent() {
  return (
    <>
      <div className="nexus-card">
        <div
          className="tabs-list tabs-nexus"
          aria-label="Pick what to show on the map"
        >
          <Link className="tabs-trigger" to="/diplomacy/map/embassy">
            🏛️
          </Link>
          <Link className="tabs-trigger" to="/government/map" disabled>
            🤝
          </Link>
          <Link className="tabs-trigger" to="/government/map" disabled>
            ⚔️
          </Link>
        </div>
        <Outlet />
      </div>
    </>
  );
}
