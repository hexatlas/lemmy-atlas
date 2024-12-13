import React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/diplomacy')({
  component: DiplomacyRouteComponent,
});

function DiplomacyRouteComponent() {
  return (
    <div id="atlas-tabs" className="atlas-tabs tabs-root">
      <div className="tabs-list">
        <Link
          className="tabs-trigger emoji-label"
          to="/diplomacy/links"
          disabled
        >
          🔗
        </Link>
        <Link className="tabs-trigger emoji-label" to="/diplomacy/map">
          🌐
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
