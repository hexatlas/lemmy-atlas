import * as React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/economy/map')({
  component: MapRouteComponent,
});

function MapRouteComponent() {
  return (
    <>
      <div className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
        <Link className="tabs-trigger" to="/economy/map/energy">
          ⚡
        </Link>
        <Link className="tabs-trigger" to="/economy/map/industry">
          🏭
        </Link>
        <Link className="tabs-trigger" to="/economy/map" disabled>
          🌾
        </Link>
        <Link className="tabs-trigger" to="/economy/map" disabled>
          📦
        </Link>
        <Link className="tabs-trigger" to="/economy/map" disabled>
          🏦
        </Link>
        <Link className="tabs-trigger" to="/economy/map" disabled>
          🚛
        </Link>
      </div>

      <Outlet />
    </>
  );
}
