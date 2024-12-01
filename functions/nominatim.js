// https://nominatim.org/release-docs/develop/api/Search/

const fetch = require('node-fetch');

exports.handler = async function (event) {
  try {
    const { query, endpoint, osm_ids, format, country } =
      event.queryStringParameters || {};

    const apiUrl = `https://nominatim.openstreetmap.org/${endpoint}?q=${query}&format=${format}&osm_ids=${osm_ids}&accept-language=en&namedetails=1&countrycodes=${country}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
