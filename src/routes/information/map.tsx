import React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/information/map')({
  component: MapRouteComponent,
});

function MapRouteComponent() {
  return (
    <>
      <div className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
        <Link className="tabs-trigger" to="/government/map" disabled>
          📰
        </Link>
        <Link className="tabs-trigger" to="/government/map" disabled>
          🎓
        </Link>
        <Link className="tabs-trigger" to="/government/map" disabled>
          💽
        </Link>
        <Link className="tabs-trigger" to="/government/map" disabled>
          📻
        </Link>
        <Link className="tabs-trigger" to="/government/map" disabled>
          📡
        </Link>
        <Link className="tabs-trigger" to="/government/map" disabled>
          🎭
        </Link>
      </div>
      <Outlet />
    </>
  );
}
