import React, { useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../__root';
import LegendLayout from '../../components/shared/AtlasLegendLayout';

export const Route = createFileRoute('/economy/links')({
  component: LinksRouteComponent,
});

function LinksRouteComponent() {
  const { activeGeographicIdentifier, activeAdministrativeRegion } =
    useContext(AtlasContext)!;

  return (
    <LegendLayout route={Route}>
      <h3>World Inequality Database</h3>
      <a
        href="https://wid.world/data/"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Visit https://wid.world/data/
      </a>

      <h3>UN Comtrade</h3>
      <a
        href="https://comtradeplus.un.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Visit UN Comtrade
      </a>

      <h3>Tradingeconomics </h3>
      <a
        href={`https://tradingeconomics.com/${encodeURI(
          activeAdministrativeRegion['country'],
        )
          .replace(/%20/g, '-')
          .toLowerCase()}/imports-by-country`}
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Visit Tradingeconomics
      </a>

      <h3>International Labour Organization</h3>
      <a
        href="https://ilostat.ilo.org/resources/sdmx-tools/"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Visit ILOSTAT
      </a>

      <h3>International Energy Agency</h3>
      {activeAdministrativeRegion.country != 'country' && (
        <>
          <a
            href={`https://www.iea.org/search/charts?q=${encodeURI(
              activeAdministrativeRegion[activeGeographicIdentifier] as string,
            )
              .replace(/%20/g, '-')
              .toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Charts on{' '}
            {activeAdministrativeRegion[activeGeographicIdentifier]}
          </a>
        </>
      )}

      <h3>World Bank</h3>
      {activeAdministrativeRegion.country != 'country' && (
        <>
          <a
            href={`https://data.worldbank.org/country/${encodeURI(
              activeAdministrativeRegion['alpha-2'],
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Data on{' '}
            {activeAdministrativeRegion[activeGeographicIdentifier]}
          </a>
        </>
      )}

      <h3>OECD</h3>
      {activeAdministrativeRegion.country != 'country' && (
        <>
          <a
            href={`https://data.oecd.org/${encodeURI(
              activeAdministrativeRegion[activeGeographicIdentifier] as string,
            )
              .replace(/%20/g, '-')
              .toLowerCase()}.htm`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Data on{' '}
            {activeAdministrativeRegion[activeGeographicIdentifier]}
          </a>
          <br />
          <a
            href={`https://data.oecd.org/searchresults/?q=${encodeURI(
              activeAdministrativeRegion[activeGeographicIdentifier] as string,
            )
              .replace(/%20/g, '-')
              .toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Search Results on{' '}
            {activeAdministrativeRegion[activeGeographicIdentifier]} (if
            previous link is not working)
          </a>
        </>
      )}

      <h3>Marxian Rates of Profit</h3>
      <a
        href="https://dbasu.shinyapps.io/World-Profitability/"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 World-Profitability Calculator
      </a>
    </LegendLayout>
  );
}
