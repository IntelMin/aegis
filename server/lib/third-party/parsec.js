const fetch = require('node-fetch');

const endpoint = 'https://api.parsec.finance/graphql'; // 172.67.184.81:443

async function graphqlRequest(query, variables = {}) {
  const requestBody = {
    query,
    variables,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return null;
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GraphQL request failed:', error);
    return null;
    throw error;
  }
}

const fetchContractLogsIntervals = variables => {
  const query = `
    query ContractLogsIntervals(
      $address: String!,
      $log: String!,
      $logInput: String!,
      $since: Int!,
      $interval: String!,
      $chain: String,
      $operator: String,
      $filters: [LogFilter]
    ) {
      contract(address: $address, chain: $chain) {
        chain
        address
        name
        logIntervals(
          log: $log
          since: $since
          filters: $filters
          logInput: $logInput
          interval: $interval
          operator: $operator
        ) {
          startTs
          endTs
          value
          __typename
        }
        __typename
      }
    }
  `;
  return graphqlRequest(query, variables);
};

module.exports = fetchContractLogsIntervals;
