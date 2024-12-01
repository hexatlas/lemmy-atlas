import React from 'react';

// https://www.imf.org/external/datamapper/api/v1/indicators
import { indicators } from '../../../data/economy/charts/indicatorsIMF.json';
import { useStateStorage } from '../../../hooks/useAtlasUtils';
import { useQuery } from '@tanstack/react-query';

// Transform IMF Data
function IMFDataTransform(apiResponse) {
  const transformedData = Object.keys(apiResponse)
    .map((indicator) => {
      const { label, description, source, unit, dataset } =
        apiResponse[indicator];

      return {
        name: indicator,
        label,
        description,
        source,
        unit,
        dataset,
      };
    })
    .filter((indicator) => indicator.label !== null) // Remove objects with label=null
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label

  return transformedData;
}

function useIMF(activeAdministrativeRegion) {
  const defaultIndicator = {
    name: 'PPPSH',
    label: 'GDP based on PPP, share of world',
    description:
      'Purchasing Power Parity (PPP) weights are individual countries\' share of total World gross domestic product at purchasing power parities.\n\nPurchasing Power Parity (PPP) is a theory which relates changes in the nominal exchange rate between two countries currencies to changes in the countries\' price levels. More information on PPP methodology can be found on the World Economic Outlook FAQ - <a href="http://www.imf.org/external/pubs/ft/weo/faq.htm#q4d" target="new">click here</a>',
    source: 'World Economic Outlook (October 2024)',
    unit: 'Percent of World',
    dataset: 'WEO',
  };

  const [activeIndicator, setActiveIndicator] = useStateStorage(
    'activeIndicator',
    defaultIndicator,
  );

  const indicatorsArray = IMFDataTransform(indicators);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result.values;
    } catch (error) {
      console.log(error);
    }
  };

  const apiUrl = `/.netlify/functions/data_imf_api/?indicator=${activeIndicator.name}&country=${activeAdministrativeRegion['ISO3166-1-Alpha-3']}/`;

  const { data: IMFData, isLoading } = useQuery({
    queryKey: [`AL-${activeAdministrativeRegion['alpha-2']}`],
    queryFn: () => fetchData(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return {
    IMFData,
    isLoading,
    indicatorsArray,
    activeIndicator,
    setActiveIndicator,
  };
}

export default useIMF;
