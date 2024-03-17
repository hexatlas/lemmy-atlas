const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const { country } = event.queryStringParameters || {};

    let apiUrl = `https://theanarchistlibrary.org/search?query=${country}&partial=1&fmt=json`;

    const response = await fetch(apiUrl);
    const data = await response.json();

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
