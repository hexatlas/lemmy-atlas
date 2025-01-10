import React, { useContext } from 'react';
import { AtlasContext } from '../../routes/__root';

import {
  geographicIdentifiers,
  LocationSelection,
} from '../../types/atlas.types';

import { handleRandom } from '../../hooks/useAtlasUtils';

function AtlasGeographyOptions() {
  const {
    isMobile,
    activeGeographicIdentifier,

    isLocationSelectMode,

    setActiveGeographicIdentifier,

    activeAdministrativeRegion,
    setActiveAdministrativeRegion,
    administrativeRegionClickHistoryArray,
  } = useContext(AtlasContext)!;

  return (
    <>
      {(activeAdministrativeRegion.country !== 'country' ||
        isLocationSelectMode) && (
        <>
          <div className="right-slot">
            <button
              role="button"
              title="Select Random Administrative Region"
              aria-label="Random Button - Select Random Administrative Region"
              className="random-button emoji"
              onClick={() => handleRandom(setActiveAdministrativeRegion)}
            >
              🎲
            </button>
          </div>

          <h1
            className={`location-name ${
              activeGeographicIdentifier === 'name' &&
              'active-geographic-identifier'
            }`}
            role="button"
            aria-label={`Select ${activeAdministrativeRegion.name}`}
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
            {activeAdministrativeRegion.name}
          </h1>
          <h5
            className={`country-name ${
              activeGeographicIdentifier === 'country' &&
              'active-geographic-identifier'
            }`}
            role="button"
            aria-label={`Select ${activeAdministrativeRegion.country}`}
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
            {activeAdministrativeRegion.country}
          </h5>
          {geographicIdentifiers.map((type, index) => {
            if (activeAdministrativeRegion[type] === '') return;
            if (type === 'name') return;
            if (type === 'country') return;
            if (type === 'unicode') return;
            if (type === 'image') return;
            if (type === 'code') return;
            if (type === 'id') return;
            if (type === 'iso_3166-2') return;
            if (type === 'ISO3166-1-Alpha-3') return;
            if (type === 'country-code') return;
            if (type === 'region-code') return;
            if (type === 'sub-region-code') return;
            if (type === 'intermediate-region-code') return;
            if (type === 'emoji') return;
            if (type === 'alpha-2') return;
            if (type === 'alpha-3') return;

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
                    setActiveGeographicIdentifier(geographicIdentifiers[type]);
                  }
                }}
              >
                {activeAdministrativeRegion[type]}
              </p>
            );
          })}
        </>
      )}

      {/* CLICK HISTORY */}
      {administrativeRegionClickHistoryArray.length > 2 && (
        <div className="location-name-click-history">
          {administrativeRegionClickHistoryArray.map(
            (adminregion: LocationSelection, index) => {
              if (
                index === 0 ||
                index > 5 ||
                adminregion.activeAdministrativeRegion.country === 'country'
              )
                return;
              return (
                <div
                  key={index}
                  className="location-name-click-history-item"
                  aria-label={`Select ${activeAdministrativeRegion.name} in ${activeAdministrativeRegion.country}`}
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
      )}
    </>
  );
}

export default AtlasGeographyOptions;
