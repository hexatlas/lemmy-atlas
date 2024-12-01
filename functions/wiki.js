// https://www.mediawiki.org/wiki/API:Main_page

const fetch = require('node-fetch');

exports.handler = async function (event) {
  try {
    const { country, wiki } = event.queryStringParameters || {};

    const apiUrl = `${wiki}/api.php?action=parse&page=${country}&format=json&redirects`;

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
