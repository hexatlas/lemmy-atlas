/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';

import geojsonData from '../../assets/geojson/administrative_regions_extended.json';
import { FeatureCollection } from 'geojson';
import { AdministrativeRegionObject } from '../../types/atlas.types';
import { latLng, latLngBounds } from 'leaflet';

const administrativeRegionsData = geojsonData as FeatureCollection;

function useNominatim(
  setActiveGeographicIdentifier,
  activeAdministrativeRegion,
  setActiveAdministrativeRegion,
  setNominatim,
  setIsOpenAtlasMapInterface,
  map,
) {
  const { 'ISO3166-2': alpha2, country } = activeAdministrativeRegion;

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<
    {
      osm_type;
      osm_id;
      place_id;
      display_name;
      licence;
    }[]
  >([]);
  const [activeSearchResult, setActiveSearchResult] = useState<{
    osm_type;
    osm_id;
    place_id;
    display_name;
    licence;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        const url = `https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json&accept-language=en&namedetails=1&countrycodes=${alpha2}`;

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
        const url2 = `/.netlify/functions/nominatim/?query=${encodeURI(
          searchTerm,
        )}&endpoint=lookup&osm_ids=${activeSearchResult?.osm_type[0]}${
          activeSearchResult?.osm_id
        }&format=geojson`;

        const url = `https://nominatim.openstreetmap.org/lookup?q=${searchTerm}&format=geojson&osm_ids=${activeSearchResult?.osm_type[0]}${
          activeSearchResult?.osm_id
        }&accept-language=en&namedetails=1&countrycodes=${alpha2}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const matchedGeoJSon = administrativeRegionsData?.features.find(
          (adminstrativeRegion) =>
            adminstrativeRegion.properties &&
            adminstrativeRegion.properties['ISO3166-2'] ===
              result.features[0].properties.address.country_code.toUpperCase(),
        );
        if (matchedGeoJSon?.properties?.name)
          matchedGeoJSon.properties.name = result.features[0].properties.name;

        setActiveGeographicIdentifier('name');
        setActiveAdministrativeRegion(
          matchedGeoJSon?.properties as AdministrativeRegionObject,
        );
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
    setSearchResults([]);
  };

  return {
    handleSearchInputChange,
    handleCLickSearchResult,
    searchTerm,
    searchResults,
    loading,
  };
}

export default useNominatim;
