const ethers = require('ethers');
const { HoneypotIsV1 } = require('@normalizex/honeypot-is');
const socketIO = require('socket.io');
const { default: axios } = require('axios');
const http = require('http');
const NodeCache = require('node-cache');

const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const PORT = 4444;

const type_cache = new NodeCache();
const token_cache = new NodeCache();
const honeypot_cache = new NodeCache();

let current_block;

const Network = () => {
  let node;
  let network;
  const blockQueue = [];
  const transactionQueue = [];
  const RATE_LIMIT = 10; // transactions per second, adjustable

  const fetchParsec = async txHash => {
    const query = `
      query Tx($hash: String!, $chain: String!) {
        tx(hash: $hash, chain: $chain) {
          hash
          to
          from
          chain
          gasUsed
          gasPrice
          gasLimit
          input
          call
          nonce
          index
          status
          value
          state
          error
          contract_creation
          timestamp
          block
          toAddressLabel {
            src
            label
            address
            tags
          }
          fromAddressLabel {
            src
            label
            address
            tags
          }
          marketData {
            type
            data
          }
          inputDecoded {
            function
            args
          }
          logs {
            address
            addressLabel {
              src
              label
              tags
              address
            }
            data
            name
            index
            topic
            rawData
            dataLabels
          }
          transfers {
            timestamp
            to
            from
            value
            address
            symbol
            decimals
            usdPrice
            imgSrc
            isNft
            toLabel {
              src
              label
              address
              tags
            }
            fromLabel {
              src
              label
              address
              tags
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.parsec.finance/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'GUEST',
      },
      body: JSON.stringify({
        operationName: 'Tx',
        variables: {
          hash: txHash,
          chain: 'eth',
        },
        query,
      }),
    });

    if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      console.log(`HTTP error! Status: ${response.status}`);
      return null;
    }

    return await response.json();
  };

  const fetchAddress = async address => {
    const baseUrl =
      'https://dashboard.misttrack.io/api/v1/address_risk_analysis';
    const coin = 'ETH';

    const headers = {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8',
      'Cache-Control': 'max-age=0',
      Cookie:
        '_bl_uid=65lz9r1d3UjmzUjvqxC9u7Iyj72a; __cuid=bd4d84291f2f4bc39c89755df5480dc9; amp_fef1e8=72a923b6-f48d-4a19-9e16-f96701cc2fe9R...1hji7684b.1hji7hf0i.4.2.6; csrftoken=8MV6Wr2Nv1qy2OcbJtghLfXqicYkCBdZeolgN1j4iUzs6cDeQ95axrWFgbf3wfcE; sessionid=y5nsthwgcololthan7wqoro1h8cok3jk',
    };

    try {
      const response = await fetch(
        `${baseUrl}?coin=${coin}&address=${address}`,
        {
          method: 'GET',
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);

      return data;
    } catch (error) {
      console.error('Error fetching address data:', error);
      return null;
      // throw error;
    }
  };

  async function checkType(address) {
    const cachedResult = type_cache.get(String(address));
    if (cachedResult) {
      return cachedResult;
    }

    try {
      // Use the getCode method to get the code at the specified address
      const code = await node.getCode(address);

      // If the code is '0x', it's an EOA, otherwise it's a contract
      if (code === '0x') {
        // console.log('The address is an externally owned account (wallet).');
        type_cache.set(String(address), 'wallet');
        return 'wallet';
      } else {
        // console.log('The address is a contract.');
        type_cache.set(String(address), 'contract');
        return 'contract';
      }
    } catch (error) {
      // console.error('Error checking address type:', error);
      // throw error;
    }
  }

  const isTokenContract = async address => {
    const cachedResult = token_cache.get(String(address));
    if (cachedResult) {
      return cachedResult;
    }

    try {
      const contract = new ethers.Contract(
        address,
        ['function totalSupply() view returns (uint256)'],
        node
      );
      const totalSupply = await contract.totalSupply();

      token_cache.set(String(address), !!totalSupply);
      return !!totalSupply;
    } catch (error) {
      return false;
    }
  };

  const isHoneypot = async token_address => {
    const cachedResult = honeypot_cache.get(String(address));
    if (cachedResult) {
      return cachedResult;
    }

    const CHAIN_ID = 1;
    const honeypotis = new HoneypotIsV1();
    const tokenAddress = token_address;

    try {
      const tokenPairs = await honeypotis.getPairs(tokenAddress, CHAIN_ID);

      if (tokenPairs.length > 0) {
        const honeypotResult = await honeypotis.honeypotScan(
          tokenAddress,
          tokenPairs[0].Router,
          tokenPairs[0].Pair,
          CHAIN_ID
        );

        result = honeypotResult.IsHoneypot;

        honeypot_cache.set(String(address), result);

        return result;
      } else {
        // Handle the case where tokenPairs is empty (no pairs found)
        console.warn('No token pairs found for the given address.');
        honeypot_cache.set(String(address), null);
        return null;
      }
    } catch (error) {
      console.error('Error checking for honeypot:', error);
      return null;
    }
  };

  async function parseTransaction(response) {
    let {
      hash,
      chain,
      from,
      fromAddressLabel,
      to,
      toAddressLabel,
      gasPrice,
      gasUsed,
      inputDecoded,
      nonce,
      block,
      value,
    } = response;

    from = fromAddressLabel ? fromAddressLabel.label : from;
    to = toAddressLabel ? toAddressLabel.label : to;

    // if (fromAddressLabel) {
    //   if (fromAddressLabel.src !== 'name') {
    //     console.log(fromAddressLabel.src, fromAddressLabel.label);
    //   }
    // }

    // if (toAddressLabel) {
    //   if (toAddressLabel.src !== 'name') {
    //     console.log(toAddressLabel.src, toAddressLabel.label);
    //   }
    // }

    let action = `sent Ξ${value.toFixed(6)}`;

    if (inputDecoded && inputDecoded.args) {
      const args = JSON.parse(inputDecoded.args);
      if (args.length > 0) {
        switch (inputDecoded.function) {
          case 'approve':
            action = inputDecoded.function + ' ' + args[0].arg;
            break;
          case 'transferFrom':
            action =
              inputDecoded.function + ' ' + args[0].arg + ' ' + args[1].arg;
            break;
          default:
            address = inputDecoded.args.match(/0x[a-fA-F0-9]{40}/);
            if (address) {
              action = inputDecoded.function + ' ' + address;
            } else {
              action = inputDecoded.function + ' ' + inputDecoded.args;
            }
            break;
        }
      } else {
        address = inputDecoded.args.match(/0x[a-fA-F0-9]{40}/);
        if (address) {
          action = inputDecoded.function + ' ' + address;
        } else {
          action = inputDecoded.function + ' ' + inputDecoded.args;
        }
      }
    }

    const results = [];

    results.push({
      type: 'tx',
      data: {
        hash,
        from,
        to,
        action,
      },
    });

    const type = await checkType(to);
    if (type === 'contract') {
      const token = await isTokenContract(to);
      if (token) {
        const honeypot = await isHoneypot(to);
        // console.log(honeypot);
        if (honeypot === 'true') {
          results.push({
            type: 'honeypot',
            data: {
              hash,
              from,
              to,
              action,
            },
          });
        } else if (honeypot === 'false') {
          console.log('Not honeypot');
        }
      }
    } else if (type === 'wallet') {
      // const risk = await fetchAddress(to);
      // console.log(risk);
    }

    return { results, type };
  }

  async function processTransaction(tx) {
    try {
      //   io.emit('log', 'Processing tx: ' + tx);
      if (tx.tx) {
        // console.log(tx.tx);
        let parsecData = await fetchParsec(tx.tx);
        // check if parsecData has data
        if (parsecData) {
          const { results, type } = await parseTransaction(parsecData.data.tx);
          io.emit('log', results);

          const blockInfo = {
            number: tx.number,
            timestamp: tx.blockTimestamp,
            transactions: 1,
            addresses: 1 ? type === 'wallet' : 0,
            contracts: 1 ? type === 'contract' : 0,
          };

          io.emit('block_status', blockInfo);
        }
      }

      // return txDetails;
    } catch (error) {
      console.error('Error processing transaction:', error);
      return null;
    }
  }

  async function processTransactionsFromQueue() {
    while (true) {
      if (transactionQueue.length > 0) {
        const transactionsToProcess = transactionQueue.splice(0, RATE_LIMIT);
        await Promise.all(
          transactionsToProcess.map(tx => processTransaction(tx))
        );

        // Calculate delay for rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // No transactions to process, short delay to reduce CPU usage
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  async function processBlockFromQueue() {
    while (true) {
      if (blockQueue.length > 0) {
        const blockNumber = blockQueue.shift();
        await processBlock(blockNumber);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async function processBlock(blockNumber) {
    try {
      const block = await node.getBlock(blockNumber);

      if (!block) {
        console.error(
          `Block with number ${blockNumber} could not be fetched or does not exist.`
        );
        return;
      }

      //   const blockInfo = {
      //     number: block.number,
      //     timestamp: block.timestamp,
      //     // transactions: block.transactions.length,
      //   };
      //   current_block = blockInfo;
      //   io.emit('block_status', blockInfo);

      block.transactions.forEach(tx => {
        let augmentedTransaction = {
          tx,
          blockTimestamp: block.timestamp,
          number: block.number,
        };
        transactionQueue.push(augmentedTransaction);
      });

      //   io.emit('log', 'Added transactions from block: ' + block.number);
      console.log(`Added transactions from block number: ${block.number}`);
    } catch (error) {
      console.error('Error processing block:', error);
    }
  }

  const load = async () => {
    try {
      node = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

      node.on('block', async blockNumber => {
        blockQueue.push(blockNumber);
      });

      console.log('Network loaded. Starting block processing...');
      processBlockFromQueue();
      processTransactionsFromQueue();
    } catch (err) {
      console.error('Error initializing network:', err);
    }
  };

  load();

  return null;
};

Network.BLOCK_FETCHING_STATUS = {
  NONE: 0,
  FETCHING_TXS: 1,
  ANALYZING: 2,
  UPDATING_TOKENS: 3,
  PROCESSING_LIMIT_ORDER: 4,
  COMPLETED: 5,
};

Network();

io.on('connection', socket => {
  console.log('A user connected');

  //   if (current_block) {
  //     socket.emit('block_status', current_block);
  //   }

  socket.emit('block_status', {
    number: 0,
    timestamp: 0,
    transactions: 0,
    addresses: 0,
    contracts: 0,
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server listening on port: ${PORT}`);
});
