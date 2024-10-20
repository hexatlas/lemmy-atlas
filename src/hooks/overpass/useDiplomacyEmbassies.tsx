import { useQuery } from "@tanstack/react-query";
import useOverpassAPI from "../useOverpassAPI";

function useDiplomacyEmbassies(activeAdministrativeRegion) {
  const overpassQuery = `
    [out:json][timeout:25];


      nwr["office"="diplomatic"]["country"="${activeAdministrativeRegion["alpha-2"]}"];

    
    out geom;
    `;

  const embassies = useQuery({
    queryKey: [`Embassies-${activeAdministrativeRegion["alpha-2"]}`],
    queryFn: () => useOverpassAPI(overpassQuery),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return embassies;
}

export default useDiplomacyEmbassies;
