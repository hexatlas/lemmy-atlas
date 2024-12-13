import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/information/nexus/')({
  component: NexusHomeComponent,
});

function NexusHomeComponent() {
  return (
    <div>
      <h1>Nexus</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum provident
        tenetur eum libero. Natus unde architecto non similique, ad minima
        accusamus sapiente officiis. Ipsa at provident, magni velit amet ipsam!
      </p>
      <h2>Instructions</h2>
      <ul className="container dark">
        <li>
          <b>ProleWiki</b>
        </li>
        <li>
          <b>NATOPedia</b>
        </li>
        <li>
          <b>72Ts Bulletin</b>
        </li>
        <li>
          <b>Anarchist Library</b>
        </li>
      </ul>
      <blockquote>
        <b>Note:</b> Data availability and accuracy may vary depending on the
        country and economic indicator.
      </blockquote>
    </div>
  );
}
