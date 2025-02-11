import { useQuery } from '@tanstack/react-query';
import useOverpassAPI from '../../shared/useOverpassAPI';

function useEconomyIndustry(activeAdministrativeRegion) {
  const overpassQuery = `
    [out:json][timeout:90];
    
    // Fetch area for the selected region
    area["ISO3166-1"="${activeAdministrativeRegion['ISO3166-2']}"]->.name;
    (
      // Fetch various industrial infrastructure features
      nwr["industrial"](area.name);
    );
    
    out geom;
  `;

  const industry = useQuery({
    queryKey: [`Industry-${activeAdministrativeRegion['ISO3166-2']}`],
    queryFn: () => useOverpassAPI(overpassQuery),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return industry;
}

export default useEconomyIndustry;
