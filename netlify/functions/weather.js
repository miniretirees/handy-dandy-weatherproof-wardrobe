export async function handler(event, context) {
    const API_KEY = process.env.API_KEY;
  
    const { latitude, longitude } = event.queryStringParameters;
  
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&appid=${API_KEY}&units=metric`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  }
  