import React from 'react';

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';
import { useStateStorage } from '../../../hooks/useAtlasUtils';
import EconomicData from './EconomicData';
import AtlasMisc from './MiscRessources';
import AtlasMapInformation from './MapInformation';

function AtlasEconomy({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    'activeEconomyTab',
    'Introduction',
  );

  return (
    <Tabs.Root
      id="atlas-tabs"
      className="atlas-tabs tabs-root"
      value={activeTab}
      onValueChange={setActiveTab}
      defaultValue={'Introduction'}
    >
      <Tabs.List className="tabs-list" aria-label="Manage your account">
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Misc">
          🔗
        </Tabs.Trigger>
        <Tabs.Trigger
          className="tabs-trigger emoji-label"
          value="MapInformation"
        >
          🌐
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Charts">
          📈
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content" value="Introduction">
        <div className="atlas-legend container light">
          <h1>Economy</h1>
          <p>
            This section provides an overview of the economic landscape,
            including key sectors, trade relationships, and economic indicators.
            It utilizes data from reputable sources such as IMF, Comtrade,
            ILOSTAT, and World Bank to offer insights into the economic
            structures of different countries.
          </p>
          <h2>Instructions</h2>

          <ul className="container dark">
            <li>
              <b>🔗 External Resources:</b> Click to access additional
              information from sources like Comtrade, ILOSTAT, and World Bank.
            </li>
            <li>
              <b>🌐 Economic Locations:</b> Use to explore Energy, Industrial,
              or Transport locations on the map.
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
              <b>📈 Economic Data:</b> View economic charts and graphs to
              understand trends and patterns.
            </li>
          </ul>
          <blockquote>
            <b>Note:</b> Data availability and accuracy may vary depending on
            the country and economic indicator.
          </blockquote>
        </div>
      </Tabs.Content>
      <Tabs.Content className="tabs-content dark" value="Misc">
        <AtlasMisc {...interfaceProps}></AtlasMisc>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="MapInformation">
        <AtlasMapInformation
          interfaceProps={interfaceProps}
        ></AtlasMapInformation>
      </Tabs.Content>
      <Tabs.Content className="tabs-content dark" value="Charts">
        <EconomicData {...interfaceProps}></EconomicData>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AtlasEconomy;
