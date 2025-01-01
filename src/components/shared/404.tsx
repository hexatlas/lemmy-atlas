import React from 'react';
import { Link } from '@tanstack/react-router';
import LegendLayout from './AtlasLegendLayout';

function NotFoundComponent({ data }: { data: unknown }) {
  return (
    <LegendLayout>
      <h1>🚫</h1>
      <p>NOT FOUND</p>
      <Link to="/">Home</Link>
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </LegendLayout>
  );
}

export default NotFoundComponent;
