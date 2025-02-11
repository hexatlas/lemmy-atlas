import { useQuery } from '@tanstack/react-query';
import useOverpassAPI from '../../shared/useOverpassAPI';

function useDiplomacyEmbassies(activeAdministrativeRegion) {
  const overpassQuery = `
    [out:json][timeout:90];


      nwr["office"="diplomatic"]["country"="${activeAdministrativeRegion['ISO3166-2']}"];

    
    out geom;
    `;

  const embassies = useQuery({
    queryKey: [`Embassies-${activeAdministrativeRegion['ISO3166-2']}`],
    queryFn: () => useOverpassAPI(overpassQuery),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return embassies;
}

export default useDiplomacyEmbassies;
