import React from 'react';
import { Link } from '@tanstack/react-router';
import LegendLayout from './LegendLayout';

function NotFoundComponent({ data }: { data: unknown }) {
  return (
    <LegendLayout>
      <h1>🚫</h1>
      <p>NOT FOUND</p>
      <Link to="/" search={{ country: 'country', bounds: '0,0,0,0', id: 0 }}>
        Home
      </Link>
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </LegendLayout>
  );
}

export default NotFoundComponent;
