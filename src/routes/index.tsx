import React, { useContext, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import BasedClientDetector from '../components/shared/BasedClientDetector';
import LegendLayout from '../components/shared/AtlasLegendLayout';
import { useStateStorage } from '../hooks/useAtlasUtils';
import { AtlasContext } from './__root';
import AtlasLocationSearch from '../components/shared/AtlasLocationSearch';

export const Route = createFileRoute('/')({
  component: AtlasHomeComponent,
});

function AtlasHomeComponent() {
  console.count('<AtlasHomeComponent />');

  const [currentTheme, setCurrentTheme] = useStateStorage<string>(
    'AtlasTheme',
    'system',
    true,
  );

  const themes = [
    { value: 'dark', label: '🌙 Dark' },
    { value: 'light', label: '☀️ Light' },
    { value: 'red', label: '✊ Red' },
    { value: 'system', label: '⚙️ System' },
  ];

  // Effect to handle theme changes
  useEffect(() => {
    updateTheme();
  }, [currentTheme]);

  // Update Theme in DOM

  const updateTheme = () => {
    const body = document.querySelector('body');

    if (currentTheme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      body?.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        body?.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      body?.setAttribute('data-theme', currentTheme);
    }
  };

  // Theme change handler
  const handleThemeChange = (event) => {
    setCurrentTheme(event.target.value);
  };

  const search = Route.useSearch();

  return (
    <LegendLayout route={Route}>
      <div className="container primary">
        <h2 className="container accent" title="emoji" aria-label="emoji">
          #8a0000
        </h2>
        <h1 className="emoji" title="atlas" aria-label="atlas">
          🅰️⠀🇹⠀🇱⠀🇦⠀🇸
        </h1>
      </div>
      <p>
        <span> </span>
        This Atlas uses OpenStreetMaps, Overpass, Nominatim, ProleWiki,
        Wikipedia, Lemmy, Mastodon, and aims to provide a comprehensive view of
        various instruments of state power across different countries.
      </p>

      <h2>Instructions</h2>

      <ul className="container dark">
        <li>
          <b>Select Country:</b> Use the search or click on the map, or 🎲 for a
          random pick.
          <AtlasLocationSearch />
        </li>
        <li>
          <b>State Power Options:</b>
          <ul className="container">
            <li>
              🪙{' '}
              <Link
                search={search}
                className="legend__link"
                to={'/economy'}
                aria-label={'economy link'}
              >
                Economy
              </Link>
            </li>
            <li>
              ℹ️{' '}
              <Link
                search={search}
                className="legend__link"
                to={'/information'}
                aria-label={'information link'}
              >
                Information
              </Link>
            </li>
            <li>
              🕊️{' '}
              <Link
                search={search}
                className="legend__link"
                to={'/diplomacy'}
                aria-label={'diplomacy link'}
              >
                Diplomacy
              </Link>
            </li>
            <li>
              🛡️{' '}
              <Link
                search={search}
                className="legend__link"
                to={'/military'}
                aria-label={'security link'}
              >
                Security
              </Link>
            </li>
            <li>
              🏛️{' '}
              <Link
                search={search}
                className="legend__link"
                to={'/government'}
                aria-label={'government link'}
              >
                Government
              </Link>
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

      <h2>Colors</h2>
      <div className="theme-selector">
        <label htmlFor="theme-select">Select Theme: </label>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={handleThemeChange}
          className="theme-select"
        >
          {themes.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
      </div>
      <blockquote>
        <i className="secondary">Attention:</i> Select an{' '}
        <span className="primary">
          <i>option</i>
        </span>{' '}
        to reveal{' '}
        <span className="accent">
          <i>selected information</i>
        </span>
        .
      </blockquote>

      <BasedClientDetector />
    </LegendLayout>
  );
}
