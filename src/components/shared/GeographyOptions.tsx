import React, { useContext } from 'react';

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';

import { AtlasContext } from '../../routes/__root';

import {
  geographicIdentifiers,
  LocationSelection,
} from '../../types/atlas.types';

function AtlasGeographyOptions() {
  const {
    isMobile,
    isLocationSelectMode,
    isOpenAtlasMapInterface,
    setIsOpenAtlasMapInterface,

    activeGeographicIdentifier,
    setActiveGeographicIdentifier,

    activeAdministrativeRegion,
    setActiveAdministrativeRegion,
    administrativeRegionClickHistoryArray,
  } = useContext(AtlasContext)!;

  return (
    <>
      {' '}
      {/* CLICK HISTORY */}
      {administrativeRegionClickHistoryArray.length > 2 && (
        <Collapsible.Root
          className="history"
          open={isOpenAtlasMapInterface}
          onOpenChange={setIsOpenAtlasMapInterface}
        >
          <Collapsible.Trigger asChild>
            <button className="expand" title="Click to Expand and Collapse">
              {isMobile ? '☰' : isOpenAtlasMapInterface ? '➖' : '🕔'}
            </button>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div className="location-name-click-history">
              {administrativeRegionClickHistoryArray.map(
                (adminregion: LocationSelection, index) => {
                  if (
                    index === 0 ||
                    index > 5 ||
                    adminregion.activeAdministrativeRegion?.country ===
                      'country'
                  )
                    return;
                  return (
                    <div
                      key={index}
                      className="location-name-click-history-item"
                      aria-label={`Select ${activeAdministrativeRegion?.name} in ${activeAdministrativeRegion?.country}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setActiveAdministrativeRegion(
                          adminregion.activeAdministrativeRegion,
                        );
                        setActiveGeographicIdentifier(
                          adminregion.activeGeographicIdentifier,
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Space') {
                          setActiveAdministrativeRegion(
                            adminregion.activeAdministrativeRegion,
                          );
                          setActiveGeographicIdentifier(
                            adminregion.activeGeographicIdentifier,
                          );
                        }
                      }}
                    >
                      <small>{adminregion.activeSelection}</small>
                    </div>
                  );
                },
              )}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
      <div className="administrative-region">
        {(activeAdministrativeRegion?.country !== 'country' ||
          isLocationSelectMode) && (
          <>
            {!isLocationSelectMode && (
              <div className="administrative-region-flag-container">
                <img
                  className="administrative-region-flag"
                  src={activeAdministrativeRegion?.image}
                  alt={`Flag of ${activeAdministrativeRegion?.country}`}
                />
              </div>
            )}
            <div className="administrative-region-container">
              <h1
                className={`location-name ${
                  activeGeographicIdentifier === 'name' &&
                  'active-geographic-identifier'
                }`}
                role="button"
                aria-label={`Select ${activeAdministrativeRegion?.name}`}
                tabIndex={0}
                onClick={() =>
                  setActiveGeographicIdentifier(geographicIdentifiers[0])
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Space') {
                    setActiveGeographicIdentifier(geographicIdentifiers[1]);
                  }
                }}
              >
                {activeAdministrativeRegion?.name}
              </h1>
              <h5
                className={`country-name ${
                  activeGeographicIdentifier === 'country' &&
                  'active-geographic-identifier'
                }`}
                role="button"
                aria-label={`Select ${activeAdministrativeRegion?.country}`}
                tabIndex={0}
                onClick={() =>
                  setActiveGeographicIdentifier(geographicIdentifiers[1])
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Space') {
                    setActiveGeographicIdentifier(geographicIdentifiers[0]);
                  }
                }}
              >
                {activeAdministrativeRegion?.country}
              </h5>
              {geographicIdentifiers.map((type, index) => {
                if (activeAdministrativeRegion[type] === '') return;
                if (type === 'name') return;
                if (type === 'country') return;
                if (type === 'image') return;
                if (type === 'id') return;
                if (type === 'country-code') return;
                if (type === 'region-code') return;
                if (type === 'sub-region-code') return;
                if (type === 'intermediate-region-code') return;
                if (type === 'emoji') return;
                if (type === 'ISO3166-2') return;
                if (type === 'ISO3166-3') return;

                return (
                  <p
                    key={index}
                    className={`country-name country-${type} ${
                      activeGeographicIdentifier === type &&
                      'active-geographic-identifier'
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${activeAdministrativeRegion[type]}`}
                    onClick={() => setActiveGeographicIdentifier(type)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Space') {
                        setActiveGeographicIdentifier(
                          geographicIdentifiers[type],
                        );
                      }
                    }}
                  >
                    {activeAdministrativeRegion[type]}
                  </p>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AtlasGeographyOptions;
