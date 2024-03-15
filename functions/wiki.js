// https://www.mediawiki.org/wiki/API:Main_page

const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const { country, wiki } = event.queryStringParameters || {};

    let apiUrl = `${wiki}/api.php?action=parse&page=${country}&format=json&redirects`;

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
