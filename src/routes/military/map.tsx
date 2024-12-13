import React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/military/map')({
  component: MapRouteComponent,
});

function MapRouteComponent() {
  return (
    <>
      <div className="nexus-card">
        <div className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Link className="tabs-trigger" to="/military/map" disabled>
            🏰
          </Link>
          <Link className="tabs-trigger" to="/military/map" disabled>
            👽
          </Link>
          <Link className="tabs-trigger" to="/military/map" disabled>
            🔫
          </Link>
          <Link className="tabs-trigger" to="/military/map" disabled>
            🚁
          </Link>
        </div>
        <Outlet />
      </div>
    </>
  );
}
