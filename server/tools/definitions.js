// server/tools/definitions.js
const tools = [
  {
    name: 'get_weather',
    description:
      'Get the current weather for a specific city. Returns temperature in Celsius, conditions, and humidity.',
    input_schema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'The city name, e.g., "Nairobi", "Mombasa", "Kisumu"',
        },
      },
      required: ['city'],
    },
  },
  {
    name: 'convert_currency',
    description:
      'Convert an amount from one currency to another. Supports KES, USD, EUR, GBP, and TZS.',
    input_schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'The amount to convert' },
        from_currency: {
          type: 'string',
          description: 'The source currency code, e.g., "KES"',
          enum: ['KES', 'USD', 'EUR', 'GBP', 'TZS'],
        },
        to_currency: {
          type: 'string',
          description: 'The target currency code, e.g., "USD"',
          enum: ['KES', 'USD', 'EUR', 'GBP', 'TZS'],
        },
      },
      required: ['amount', 'from_currency', 'to_currency'],
    },
  },
  {
    name: 'check_mpesa_transaction',
    description:
      'Look up the status of an M-Pesa transaction by its transaction ID (e.g., "SHJ7Y5KXQR"). Returns the amount, date, status, and recipient.',
    input_schema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
          description: 'The M-Pesa transaction ID, e.g., "SHJ7Y5KXQR"',
        },
      },
      required: ['transaction_id'],
    },
  },
];

module.exports = {tools};