// https://www.mediawiki.org/wiki/API:Main_page

import fetch from 'node-fetch';

export const handler = async function (event) {
  try {
    const { country } = event.queryStringParameters || {};

    const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${country}&format=json&redirects`;

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
