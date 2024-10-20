import { useQuery } from "@tanstack/react-query";
import useOverpassAPI from "../useOverpassAPI";

function useEconomyEnergy(activeAdministrativeRegion) {
  const overpassQuery = `
    [out:json][timeout:25];
    
    // Fetch area for the selected region
    area["ISO3166-1"="${activeAdministrativeRegion["alpha-2"]}"]->.name;
    (
      // Fetch features based on the active location type (e.g., aerodromes)
      nwr["power"="plant"](area.name);
    );
    
    out geom;
    `;

  const energy = useQuery({
    queryKey: [`Energy-${activeAdministrativeRegion["alpha-2"]}`],
    queryFn: () => useOverpassAPI(overpassQuery),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return energy;
}

export default useEconomyEnergy;
