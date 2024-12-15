import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/diplomacy/map/')({
  component: MapHomeComponent,
});

function MapHomeComponent() {
  return (
    <div>
      <h1>MAP Index</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum provident
        tenetur eum libero. Natus unde architecto non similique, ad minima
        accusamus sapiente officiis. Ipsa at provident, magni velit amet ipsam!
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