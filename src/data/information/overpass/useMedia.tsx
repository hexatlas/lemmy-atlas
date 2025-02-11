import { useQuery } from '@tanstack/react-query';
import useOverpassAPI from '../../shared/useOverpassAPI';

function useInformationMedia(activeAdministrativeRegion) {
  const overpassQuery = `
    [out:json][timeout:90];
    
    // Fetch area for the selected region
    area["ISO3166-1"="${activeAdministrativeRegion['ISO3166-2']}"]->.name;
    (
      // Fetch print media (newspapers)
      nwr["type"="newspaper"](area.name);
      // Fetch radio stations
      nwr["amenity"="radio_station"](area.name);
      // Fetch television stations
      nwr["amenity"="tv_station"](area.name);
      // Fetch telecommunication towers
      nwr["man_made"="tower"]["tower:type"="communication"](area.name);
      // Fetch fiber optic cables
      nwr["cable"="fiber_optic"](area.name);
      // Fetch data centers
      nwr["building"="data_center"](area.name);
    );
    
    out geom;
  `;

  const media = useQuery({
    queryKey: [`Media-${activeAdministrativeRegion['ISO3166-2']}`],
    queryFn: () => useOverpassAPI(overpassQuery),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return media;
}

export default useInformationMedia;
