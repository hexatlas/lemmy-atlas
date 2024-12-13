import React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/government')({
  component: GovernmentRouteComponent,
});

function GovernmentRouteComponent() {
  return (
    <div id="atlas-tabs" className="atlas-tabs tabs-root">
      <div className="tabs-list">
        <Link
          className="tabs-trigger emoji-label"
          to="/government/links"
          disabled
        >
          🔗
        </Link>
        <Link className="tabs-trigger emoji-label" to="/government/map">
          🌐
        </Link>
        <Link className="tabs-trigger emoji-label" to="/government/class">
          🎩
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
