import { useQuery } from "@tanstack/react-query";
import useOverpassAPI from "../useOverpassAPI";

function useEconomyIndustry(activeAdministrativeRegion) {
  const overpassQuery = `
    [out:json][timeout:25];
    
    // Fetch area for the selected region
    area["ISO3166-1"="${activeAdministrativeRegion["alpha-2"]}"]->.name;
    (
      // Fetch various industrial infrastructure features
      nwr["industrial"](area.name);
    );
    
    out geom;
  `;

  const industry = useQuery({
    queryKey: [`Industry-${activeAdministrativeRegion["alpha-2"]}`],
    queryFn: () => useOverpassAPI(overpassQuery),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return industry;
}

export default useEconomyIndustry;
