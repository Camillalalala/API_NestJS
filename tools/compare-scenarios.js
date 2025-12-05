/* eslint-disable no-console */
const axios = require('axios');
const fs = require('fs');

const scenarios = {
  direct: [
    'http://localhost:3001/clubs',
    'http://localhost:3002/events',
    'http://localhost:3005/users',
  ],
  gateway: [
    'http://localhost:3003/clubs/clubs',
    'http://localhost:3003/events/events',
    'http://localhost:3003/users/users',
  ],
};

async function sendRequests(scenarioName, urls) {
  const results = [];

  for (const url of urls) {
    const start = Date.now();
    try {
      const res = await axios.get(url);
      const end = Date.now();
      results.push({
        url,
        status: res.status,
        timestamp: new Date().toISOString(),
        latency: end - start,
      });
    } catch (err) {
      const end = Date.now();
      results.push({
        url,
        status: err.response?.status || 'ERROR',
        timestamp: new Date().toISOString(),
        latency: end - start,
      });
    }
  }

  fs.writeFileSync(
    `${scenarioName}_results.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(`Results saved to ${scenarioName}_results.json`);
}

(async () => {
  await sendRequests('direct', scenarios.direct);
  await sendRequests('gateway', scenarios.gateway);
})();
