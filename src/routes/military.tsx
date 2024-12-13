import React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/military')({
  component: MilitaryRouteComponent,
});

function MilitaryRouteComponent() {
  return (
    <div id="atlas-tabs" className="atlas-tabs tabs-root">
      <div className="tabs-list">
        <Link
          className="tabs-trigger emoji-label"
          to="/military/links"
          disabled
        >
          🔗
        </Link>
        <Link className="tabs-trigger emoji-label" to="/military/map">
          🌐
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
