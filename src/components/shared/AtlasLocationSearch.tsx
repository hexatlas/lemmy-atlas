import React, { useContext } from 'react';

import { AtlasContext } from '../../routes/__root';
import { handleRandom } from '../../hooks/useAtlasUtils';
import useNominatim from '../../data/shared/useNominatim';

function AtlasLocationSearch() {
  const {
    // Util
    resetAtlas,

    // Location
    map,
    setIsOpenAtlasMapInterface,
    setNominatim,

    activeGeographicIdentifier,
    setActiveGeographicIdentifier,

    activeAdministrativeRegion,
    setActiveAdministrativeRegion,
  } = useContext(AtlasContext)!;

  const {
    handleSearchInputChange,
    handleCLickSearchResult,
    searchTerm,
    searchResults,
    loading,
  } = useNominatim(
    setActiveGeographicIdentifier,
    activeAdministrativeRegion,
    setActiveAdministrativeRegion,
    setNominatim,
    setIsOpenAtlasMapInterface,
    map,
  );

  const { country } = activeAdministrativeRegion;

  return (
    <div id="location-search">
      <div className="search-input-wrapper search-input-interface">
        {activeAdministrativeRegion.country === 'country' && (
          <button
            role="button"
            title="Select Random Administrative Region"
            aria-label="Random Button - Select Random Administrative Region"
            className="button-emoji atlas-expand-button"
            onClick={() => handleRandom(setActiveAdministrativeRegion)}
          >
            🎲
          </button>
        )}
        {country !== 'country' && (
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
            Search Location in {country}
          </label>
          <input
            className="search-input"
            type="text"
            placeholder={`Search Location ${
              country !== 'country' ? `in ${country}` : ''
            }`}
            aria-label={`Search Location ${
              country !== 'country' ? `in ${country}` : ''
            }`}
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      {(searchTerm.trim() !== '' || searchResults.length > 0) && (
        <ul className="search-results">
          {loading && <p className="search-loading-emoji">🔍</p>}
          {searchResults.map((result) => (
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
          <small className="search-licence">{searchResults[0]?.licence}</small>
        </ul>
      )}
    </div>
  );
}

export default AtlasLocationSearch;
