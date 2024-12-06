import React, { useEffect, useState } from 'react';
import administrativeRegionsData from './assets/geojson/administrative_regions_extended.json';

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from '@radix-ui/react-collapsible';
import { handleRandom } from './hooks/useAtlasUtils';

import { geographicIdentifiers } from '../src/types/atlas.types';
import { latLng, latLngBounds } from 'leaflet';

/*

 /$$$$$$             /$$                          /$$$$$$                             
|_  $$_/            | $$                         /$$__  $$                            
  | $$   /$$$$$$$  /$$$$$$    /$$$$$$   /$$$$$$ | $$  \__//$$$$$$   /$$$$$$$  /$$$$$$ 
  | $$  | $$__  $$|_  $$_/   /$$__  $$ /$$__  $$| $$$$   |____  $$ /$$_____/ /$$__  $$
  | $$  | $$  \ $$  | $$    | $$$$$$$$| $$  \__/| $$_/    /$$$$$$$| $$      | $$$$$$$$
  | $$  | $$  | $$  | $$ /$$| $$_____/| $$      | $$     /$$__  $$| $$      | $$_____/
 /$$$$$$| $$  | $$  |  $$$$/|  $$$$$$$| $$      | $$    |  $$$$$$$|  $$$$$$$|  $$$$$$$
|______/|__/  |__/   \___/   \_______/|__/      |__/     \_______/ \_______/ \_______/
                                                                                      
                                                                                                                                                                            
*/

export default function AtlasInterface({
  // Util
  isMobile,
  resetAtlas,

  legendSize,
  setLegendSize,

  // Location
  map,

  isOpenAtlasMapInterface,
  setIsOpenAtlasMapInterface,

  isLocationSelectMode,
  setIsLocationSelectMode,
  setNominatim,

  activeGeographicIdentifier,
  setActiveGeographicIdentifier,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
}) {
  /*
      useStates 
  */

  /* 
      Handlers
   */
  const handleNexusResize = (mouseDownEvent) => {
    const startSize = legendSize;
    const startPosition = mouseDownEvent.pageX;

    function onMouseMove(mouseMoveEvent) {
      setLegendSize(document.body.clientWidth - mouseMoveEvent.clientX);
    }
    function onMouseUp() {
      document.body.removeEventListener('mousemove', onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp, { once: true });
  };

  const handleLocationSelection = () => {
    resetAtlas();
    setIsOpenAtlasMapInterface(true);
    setIsLocationSelectMode(!isLocationSelectMode);
  };

  /*
    Component
  */

  const LocationSearch = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeSearchResult, setActiveSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const debounce = setTimeout(() => {
        if (searchTerm.trim() !== '') handleSearch();
      }, 1312);
      return () => clearTimeout(debounce);
    }, [searchTerm]);

    useEffect(() => {
      handleLookUp();
    }, [activeSearchResult]);

    const handleSearch = async () => {
      try {
        if (searchTerm.trim() !== '') {
          const url = `/.netlify/functions/nominatim/?query=${encodeURI(
            searchTerm,
          )}&endpoint=search&format=json&country=${
            activeAdministrativeRegion['alpha-2']
          }`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          setSearchResults(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Invalid regular expression:', error.message);
        setSearchResults([]);
      }
    };

    const handleLookUp = async () => {
      try {
        if (searchTerm.trim() !== '') {
          const url = `/.netlify/functions/nominatim/?query=${encodeURI(
            searchTerm,
          )}&endpoint=lookup&osm_ids=${activeSearchResult.osm_type[0]}${
            activeSearchResult.osm_id
          }&format=geojson`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          const matchedGeoJSon = administrativeRegionsData?.features.find(
            (adminstrativeRegion) =>
              adminstrativeRegion.properties['alpha-2'] ===
              result.features[0].properties.address.country_code.toUpperCase(),
          );
          matchedGeoJSon.properties.name = result.features[0].properties.name;

          setActiveGeographicIdentifier('name');
          setActiveAdministrativeRegion(matchedGeoJSon.properties);
          setNominatim(result);
          setIsOpenAtlasMapInterface(false);
        }
      } catch (error) {
        console.error('Invalid regular expression:', error.message);
        setSearchResults([]);
      }
    };

    const handleSearchInputChange = (e) => {
      const query = e.target.value;
      setLoading(true);
      setSearchTerm(query);
    };

    const handleCLickSearchResult = (result) => {
      const corner1 = latLng(result.boundingbox[0], result.boundingbox[2]);
      const corner2 = latLng(result.boundingbox[1], result.boundingbox[3]);
      const bounds = latLngBounds(corner1, corner2);
      map?.fitBounds(bounds);
      setActiveSearchResult(result);
    };
    return (
      <div id="location-search">
        {!isMobile && (
          <div className="right-slot">
            <button
              role="button"
              title="Click and Drag to Resize"
              aria-label="Resize Button. Click and Drag to Resize"
              className="legend-resize-button emoji"
              onMouseDown={handleNexusResize}
            >
              ↔️
            </button>
            {/* <button
              role="button"
              title="Select Locations"
              aria-label="Click to Select Locations"
              className="legend-resize-button"
              onMouseDown={handleLocationSelection}
            >
              🖊️
            </button> */}
          </div>
        )}
        <div className="search-input-wrapper search-input-interface">
          {children}
          {activeAdministrativeRegion.country !== 'country' && (
            <button
              role="button"
              title="Reset Atlas to default settings"
              aria-label="Styled Reset Atlas Settings to default settings"
              className="atlas-reset-button"
              onClick={resetAtlas}
            >
              {activeAdministrativeRegion[activeGeographicIdentifier]} ⨯
            </button>
          )}
          <div className="search-form">
            <label htmlFor="search-input" className="sr-only">
              Search Location in {activeAdministrativeRegion.country}
            </label>
            <input
              className="search-input"
              type="text"
              placeholder={`Search Location ${
                activeAdministrativeRegion.country !== 'country'
                  ? `in ${activeAdministrativeRegion.country}`
                  : ''
              }`}
              aria-label={`Search Location ${
                activeAdministrativeRegion.country !== 'country'
                  ? `in ${activeAdministrativeRegion.country}`
                  : ''
              }`}
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        {(searchTerm.trim() !== '' || searchResults.length > 0) && (
          <ul className="search-results">
            {loading && <p className="search-loading-emoji">🔍</p>}
            {searchResults.map((result, index) => (
              <li key={result.place_id}>
                <button
                  onClick={() => handleCLickSearchResult(result)}
                  role="button"
                  aria-label={`Select ${result.display_name}`}
                >
                  {result.display_name}
                </button>
              </li>
            ))}
            {!loading && searchResults.length <= 0 && <p>🪹</p>}
            <small className="search-licence">
              {searchResults[0]?.licence}
            </small>
          </ul>
        )}
      </div>
    );
  };

  const ActiveStatesDownloader = () => {
    const data = {
      activeGeographicIdentifier,
      activeAdministrativeRegion,
      administrativeRegionClickHistoryArray,
    };

    const downloadJSON = () => {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HexAtlas_ActiveStates.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <>
        <button
          onClick={downloadJSON}
          role="button"
          title="Select Random Administrative Region"
          aria-label="Random Button - Select Random Administrative Region"
          className="button-emoji"
        >
          💾
        </button>
      </>
    );
  };

  return (
    <Collapsible.Root
      className="map-interface-container"
      open={isOpenAtlasMapInterface}
      onOpenChange={setIsOpenAtlasMapInterface}
    >
      <LocationSearch>
        {activeAdministrativeRegion.country === 'country' ? (
          <button
            role="button"
            title="Select Random Administrative Region"
            aria-label="Random Button - Select Random Administrative Region"
            className="button-emoji atlas-expand-button"
            onClick={() => handleRandom(setActiveAdministrativeRegion)}
          >
            🎲
          </button>
        ) : (
          <Collapsible.Trigger asChild>
            <button
              className="button-emoji atlas-expand-button"
              title="Click to Expand and Collapse"
            >
              {isMobile ? '☰' : isOpenAtlasMapInterface ? '⊟' : '⊞'}
            </button>
          </Collapsible.Trigger>
        )}
      </LocationSearch>

      <Collapsible.Content>
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
            {!isMobile && !isLocationSelectMode && (
              <div className="administrative-region-flag-container">
                <img
                  className="administrative-region-flag"
                  src={activeAdministrativeRegion.image}
                  alt={`Flag of ${activeAdministrativeRegion.country}`}
                />
              </div>
            )}
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
              if (isLocationSelectMode && type === 'emoji') return;
              if (isLocationSelectMode && type === 'alpha-2') return;
              if (isLocationSelectMode && type === 'alpha-3') return;

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
          </>
        )}
        {administrativeRegionClickHistoryArray.length > 2 && (
          <div className="location-name-click-history">
            {administrativeRegionClickHistoryArray.map((adminregion, index) => {
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
            })}
          </div>
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
