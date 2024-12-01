import { useQuery } from '@tanstack/react-query';
import useOverpassAPI from '../../shared/useOverpassAPI';

function useEconomyTransport(activeAdministrativeRegion) {
  const overpassQuery = `
    [out:json][timeout:90];
    
    // Fetch area for the selected region
    area["ISO3166-1"="${activeAdministrativeRegion['alpha-2']}"]->.name;
    (
      // Fetch light rail
      nwr["railway"="light_rail"](area.name);
      // Fetch subway
      nwr["railway"="subway"](area.name);
      // Fetch narrow gauge
      nwr["railway"="narrow_gauge"](area.name);
      // Fetch monorail
      nwr["railway"="monorail"](area.name);
      // Fetch preserved railways
      nwr["railway:preserved"](area.name);
      // Fetch funicular
      nwr["railway"="funicular"](area.name);
    );
    
    out geom;
    `;
  const transport = useQuery({
    queryKey: [`Transport-${activeAdministrativeRegion['alpha-2']}`],
    queryFn: () => useOverpassAPI(overpassQuery),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return transport;
}

export default useEconomyTransport;
