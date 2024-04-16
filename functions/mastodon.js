// https://mastodon.social/api/v1/timelines/tag/germany

const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const { country } = event.queryStringParameters || {};

    let apiUrl = `https://mastodon.social/api/v1/timelines/tag/${country}`;

    let response = await fetch(apiUrl);
    let data = await response.json();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};
