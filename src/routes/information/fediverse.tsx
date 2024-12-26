import React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/information/fediverse')({
  component: FediverseRouteComponent,
});

function FediverseRouteComponent() {
  return (
    <>
      <div className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
        <Link className="tabs-trigger" to="/information/fediverse/lemmy">
          Lemmy
        </Link>
        <Link className="tabs-trigger" to="/information/fediverse/mastodon">
          Mastodon
        </Link>
      </div>

      <Outlet />
    </>
  );
}
