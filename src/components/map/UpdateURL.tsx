import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useMapEvent } from 'react-leaflet';

function UpdateURL({ route, map }: { route; map }) {
  const navigate = useNavigate({ from: route.fullPath });

  useMapEvent('movestart', updateURL);

  function updateURL() {
    navigate({
      // @ts-expect-error Tsy
      search: (prev) => ({
        ...prev,
        bounds: map?.getBounds().toBBoxString(),
      }),
    });
  }
  return null;
}

export default UpdateURL;
