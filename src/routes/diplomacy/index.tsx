import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/diplomacy/')({
  component: DiplomacyHomeComponent,
});

function DiplomacyHomeComponent() {
  return (
    <div className="atlas-legend container">
      <h1>Diplomacy</h1>
      <p>
        This section provides an overview of the economic landscape, including
        key sectors, trade relationships, and economic indicators. It utilizes
        data from reputable sources such as IMF, Comtrade, ILOSTAT, and World
        Bank to offer insights into the economic structures of different
        countries.
      </p>
      <h2>Instructions</h2>

      <ul className="container dark">
        <li>
          <b>🔗 External Resources:</b> Click to access additional information
          from sources like Comtrade, ILOSTAT, and World Bank.
        </li>
        <li>
          <b>🌐 Economic Locations:</b> Use to explore Energy, Industrial, or
          Transport locations on the map.
          <ul className="container">
            <li>
              🏛️ <b>Embassy</b>
            </li>
          </ul>
        </li>
        <li>
          <b>📈 Economic Data:</b> View economic charts and graphs to understand
          trends and patterns.
        </li>
      </ul>
      <blockquote>
        <b>Note:</b> Data availability and accuracy may vary depending on the
        country and economic indicator.
      </blockquote>
    </div>
  );
}
