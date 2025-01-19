import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LegendLayout from '../../components/shared/LegendLayout';

export const Route = createFileRoute('/economy/')({
  component: EconomyHomeComponent,
});

function EconomyHomeComponent() {
  return (
    <LegendLayout route={Route}>
      <h1>Economy</h1>
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
              🏭 <b>Industry</b>
            </li>
            <li>
              ⚡ <b>Energy</b>
            </li>
            <li>
              🚈 <b>Transport</b>
            </li>
          </ul>
        </li>
        <li>
          <b>📈 Economic Data:</b> View economic charts and graphs to understand
          trends and patterns.
        </li>
      </ul>
    </LegendLayout>
  );
}
