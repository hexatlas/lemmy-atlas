import React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/economy')({
  component: EconomyRouteComponent,
});

function EconomyRouteComponent() {
  return (
    <div id="atlas-tabs" className="atlas-tabs tabs-root">
      <div className="tabs-list">
        <Link className="tabs-trigger emoji-label" to="/economy/links">
          🔗
        </Link>
        <Link className="tabs-trigger emoji-label" to="/economy/map">
          🌐
        </Link>
        <Link className="tabs-trigger emoji-label" to="/economy/charts">
          📈
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
