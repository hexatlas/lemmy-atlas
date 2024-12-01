// https://www.imf.org/external/datamapper/api/help
const fetch = require('node-fetch')

exports.handler = async function (event, context) {
  try {
    const { indicator, country } = event.queryStringParameters || {}
    if (!indicator) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required indicator parameter' })
      }
    }

    let apiUrl = `https://www.imf.org/external/datamapper/api/v1/${indicator}`

    if (country) {
      apiUrl += `/${country}`
    }
    const response = await fetch(apiUrl)
    const data = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    }
  }
}
