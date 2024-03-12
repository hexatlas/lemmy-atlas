const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const { country } = event.queryStringParameters || {};

    let apiUrl = `https://bulletins.hexbear.net/tags/${country}/index.xml`;

    const response = await fetch(apiUrl);
    const xmlData = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: xmlData,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};
