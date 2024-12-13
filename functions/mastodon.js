// https://mastodon.social/api/v1/timelines/tag/germany

import fetch from 'node-fetch';

export const handler = async function (event) {
  try {
    const { country } = event.queryStringParameters || {};

    const apiUrl = `https://mastodon.social/api/v1/timelines/tag/${country}`;

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
