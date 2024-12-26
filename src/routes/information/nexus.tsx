import React from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/information/nexus')({
  component: NexusRouteComponent,
});

function NexusRouteComponent() {
  return (
    <>
      <div className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
        <Link className="tabs-trigger" to="/information/nexus/prolewiki">
          ProleWiki
        </Link>
        <Link className="tabs-trigger" to="/information/nexus/natopedia">
          NATOPedia
        </Link>
        <Link className="tabs-trigger" to="/information/nexus/72Tbulletins">
          72Ts Bulletins
        </Link>
        <Link className="tabs-trigger" to="/information/nexus/anarchistlibrary">
          Anarchist Library
        </Link>
      </div>
      <Outlet />
    </>
  );
}
