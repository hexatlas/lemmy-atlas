import React, { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import BasedClientDetector from '../components/shared/BasedClientDetector';
import LegendLayout from '../components/shared/AtlasLegendLayout';
import { useStateStorage } from '../hooks/useAtlasUtils';

export const Route = createFileRoute('/')({
  component: AtlasHomeComponent,
});

function AtlasHomeComponent() {
  const [currentTheme, setCurrentTheme] = useStateStorage<string>(
    'AtlasTheme',
    'system',
    true,
  );

  const themes = [
    { value: 'dark', label: '🌙 Dark' },
    { value: 'light', label: '☀️ Light' },
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

  return (
    <LegendLayout route={Route}>
      <h2 className="emoji" title="emoji" aria-label="emoji">
        🇪⠀🇲⠀🇴⠀🇯⠀🇮
      </h2>
      <h1 className="emoji" title="atlas" aria-label="atlas">
        🅰️⠀🇹⠀🇱⠀🇦⠀🇸
      </h1>
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
              🏛️ <b>Government</b>
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
        <span className="tertiary">
          <i>selected information</i>
        </span>
        .
      </blockquote>

      <BasedClientDetector />
    </LegendLayout>
  );
}
