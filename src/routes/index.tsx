import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import BasedClientDetector from '../components/shared/BasedClientDetector';

export const Route = createFileRoute('/')({
  component: AtlasHomeComponent,
});

function AtlasHomeComponent() {
  return (
    <div className="tabs-content">
      <div className="atlas-legend container">
        <h2 className="emoji" title="emoji" aria-label="emoji">
          🇪⠀🇲⠀🇴⠀🇯⠀🇮
        </h2>
        <h1 className="emoji" title="atlas" aria-label="atlas">
          🅰️⠀🇹⠀🇱⠀🇦⠀🇸
        </h1>
        <p>
          <span> </span>
          This Atlas uses OpenStreetMaps, Overpass, Nominatim, ProleWiki,
          Wikipedia, Lemmy, Mastodon, and aims to provide a comprehensive view
          of various instruments of state power across different countries.
        </p>
        <h2>Instructions</h2>
        <blockquote>
          <i className="secondary">Attention:</i> Select an{' '}
          <span className="primary">
            <i>option</i>
          </span>{' '}
          to reveal{' '}
          <span className="tertiary">
            <i>selected information</i>
          </span>
          .
        </blockquote>
        <ul className="container dark">
          <li>
            <b>Select Country:</b> Use the search or click on the map, or 🎲 for
            a random pick.
          </li>
          <li>
            <b>State Power Options:</b>
            <ul className="container">
              <li>
                🪙 <b>Economy</b>
              </li>
              <li>
                ℹ️ <b>Information</b>
              </li>
              <li>
                🕊️ <b>Diplomacy</b>
              </li>
              <li>
                🛡️ <b>Security</b>
              </li>
              <li>
                🏛️ <b>Institutions</b>
              </li>
            </ul>
          </li>
          <li>
            🗺️ <b>Map Layers:</b> Switch between satellite, terrain, or
            boundaries.
          </li>
          <li>
            🌐 <b>Show on Map:</b> Look for 📍 to pinpoint locations.
          </li>
          <li>
            🔗 <b>Extra Resources:</b> Click for further reading.
          </li>
        </ul>

        <blockquote>
          <b>Note:</b> Data availability differs by country and topic.
        </blockquote>
        <BasedClientDetector />
      </div>
    </div>
  );
}
