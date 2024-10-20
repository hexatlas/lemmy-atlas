import useEconomyEnergy from "./overpass/useEconomyEnergy";
import useEconomyTransport from "./overpass/useEconomyTransport";
import { useStateStorage } from "./useAtlasUtils";

function useOverpass(activeAdministrativeRegion) {
  return useEconomyEnergy(activeAdministrativeRegion);

  const [activeMainTab] = useStateStorage("activeMainTab", null);

  let economy;
  let transport;

  if (activeMainTab === "Economy") {
    const [activeEconomyMapInformationTab] = useStateStorage(
      "activeEconomyMapInformationTab",
      null
    );

    switch (activeEconomyMapInformationTab) {
      case "Energy":
        break;
      case "Transport":
        return (transport = useEconomyTransport(activeAdministrativeRegion));
        break;

      default:
        break;
    }
  }
}

export default useOverpass;
