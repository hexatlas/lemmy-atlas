import React, { useEffect, useState } from 'react';

function useWikiDataImages(wikidata) {
  const [imagesArray, setImagesArray] = useState([]);

  // https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=Qxxx&origin=*

  useEffect(() => {
    setImagesArray([]);
    const fetchImageData = async () => {
      const apiUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidata}&props=claims&format=json&origin=*`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const entity = data.entities[wikidata];
        if (!entity?.claims?.P18) return [];

        // Process all image claims
        return entity.claims.P18.filter(
          (claim) => claim.mainsnak?.datavalue?.value,
        ) // Filter valid claims
          .map((claim) => {
            const filename = claim.mainsnak.datavalue.value;

            // Format filename and create URL
            const formattedFilename = filename
              .replace(/ /g, '_') // Replace spaces with underscores
              .replace(/"/g, ''); // Remove quotes if present

            return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(formattedFilename)}`;
          });
      } catch (error) {
        console.error('Error fetching Wikidata data:', error);
        return [];
      }
    };

    // Fetch data on component mount
    if (wikidata) {
      fetchImageData().then((imageUrls) => {
        if (imageUrls.length > 0) {
          setImagesArray(imageUrls);
        }
      });
    }
  }, [wikidata]);

  return imagesArray;
}

export default useWikiDataImages;
