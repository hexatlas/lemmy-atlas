import React from 'react';

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

import { useStateStorage } from '../../hooks/useAtlasUtils';

import AtlasEconomy from './economy/Index';
import AtlasInformation from './information/Index';
import AtlasDiplomacy from './diplomacy/Index';
import AtlasMilitary from './military/Index';
import AtlasGovernment from './government/Index';

import BasedClientDetector from '../shared/BasedClientDetector';

function AtlasLegend({ interfaceProps }) {
  const [activeMainTab, setActiveMainTab] = useStateStorage(
    'activeMainTab',
    undefined,
  );

  return (
    <Tabs.Root
      id="atlas-tabs"
      className="atlas-tabs tabs-root"
      ref={interfaceProps.sideBarRef}
      value={activeMainTab}
      onValueChange={setActiveMainTab}
      defaultValue={'Introduction'}
    >
      <Tabs.List className="tabs-list" aria-label="Manage your account">
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Economy">
          🪙
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Information">
          ℹ️
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Diplomacy">
          🕊️
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Military">
          🛡️
        </Tabs.Trigger>
        <Tabs.Trigger
          className="tabs-trigger emoji-label"
          value="ClassStructure"
        >
          🏛️
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content" value="Introduction">
        <div className="atlas-legend container light">
          <h2 className="emoji">🇪 🇲⠀🇴⠀🇯⠀🇮</h2>
          <h1 className="emoji">🅰️⠀🇹⠀🇱⠀🇦⠀🇸</h1>
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
              <b>Select Country:</b> Use the search or click on the map, or 🎲
              for a random pick.
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
          <BasedClientDetector isMobile={interfaceProps.isMobile} />
        </div>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="Economy">
        <AtlasEconomy interfaceProps={interfaceProps}></AtlasEconomy>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="Information">
        <AtlasInformation interfaceProps={interfaceProps}></AtlasInformation>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="Diplomacy">
        <AtlasDiplomacy interfaceProps={interfaceProps}></AtlasDiplomacy>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="Military">
        <AtlasMilitary interfaceProps={interfaceProps}></AtlasMilitary>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="ClassStructure">
        <AtlasGovernment interfaceProps={interfaceProps}></AtlasGovernment>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AtlasLegend;
