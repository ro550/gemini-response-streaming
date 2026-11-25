// server/tools/handlers.js
const weatherData = {
  nairobi: { temperature: 22, conditions: 'Partly cloudy', humidity: 65, wind: '12 km/h NE' },
  mombasa: { temperature: 29, conditions: 'Sunny', humidity: 78, wind: '18 km/h SE' },
  kisumu: { temperature: 26, conditions: 'Light rain', humidity: 82, wind: '8 km/h W' },
  nakuru: { temperature: 20, conditions: 'Overcast', humidity: 70, wind: '10 km/h S' },
  eldoret: { temperature: 18, conditions: 'Cool and clear', humidity: 55, wind: '6 km/h NW' },
};

const exchangeRates = { KES: 1, USD: 0.0065, EUR: 0.0059, GBP: 0.0051, TZS: 16.25 };

const transactions = {
  SHJ7Y5KXQR: {
    amount: 2500, currency: 'KES', date: '2026-05-02T14:30:00Z',
    status: 'completed', type: 'payment', recipient: 'Jumia Kenya', phone: '254712XXXXX',
  },
  PLK9M2VNBT: {
    amount: 15000, currency: 'KES', date: '2026-05-01T09:15:00Z',
    status: 'completed', type: 'transfer', recipient: 'John Kamau', phone: '254798XXXXX',
  },
  QWR4T8HJNX: {
    amount: 500, currency: 'KES', date: '2026-05-03T08:00:00Z',
    status: 'pending', type: 'payment', recipient: 'Kenya Power', phone: '254712XXXXX',
  },
};

function getWeather({ city }) {
  const data = weatherData[city.toLowerCase().trim()];
  if (!data) {
    return { error: `Weather data not available for "${city}". Available: ${Object.keys(weatherData).join(', ')}` };
  }
  return { city, temperature: data.temperature, conditions: data.conditions, humidity: data.humidity, wind: data.wind, unit: 'Celsius' };
}

function convertCurrency({ amount, from_currency, to_currency }) {
  if (from_currency === to_currency) {
    return { from: { amount, currency: from_currency }, to: { amount, currency: to_currency }, rate: 1 };
  }
  const amountInKES = amount / exchangeRates[from_currency];
  const converted = amountInKES * exchangeRates[to_currency];
  const rate = Math.round((exchangeRates[to_currency] / exchangeRates[from_currency]) * 10000) / 10000;
  return {
    from: { amount, currency: from_currency },
    to: { amount: Math.round(converted * 100) / 100, currency: to_currency },
    rate,
    note: `1 ${from_currency} = ${rate} ${to_currency}`,
  };
}

function checkMpesaTransaction({ transaction_id }) {
  const tx = transactions[transaction_id.toUpperCase().trim()];
  if (!tx) {
    return { error: `Transaction "${transaction_id}" not found. Check the ID and try again.` };
  }
  return {
    transaction_id: transaction_id.toUpperCase(),
    amount: `KES ${tx.amount.toLocaleString()}`,
    date: new Date(tx.date).toLocaleString('en-KE', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Nairobi' }),
    status: tx.status, type: tx.type, recipient: tx.recipient, masked_phone: tx.phone,
  };
}

const toolHandlers = {
  get_weather: getWeather,
  convert_currency: convertCurrency,
  check_mpesa_transaction: checkMpesaTransaction,
};

module.exports = { toolHandlers };