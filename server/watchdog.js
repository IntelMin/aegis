const ethers = require('ethers');
const socketIO = require('socket.io');
const http = require('http');
const processBlockFromQueue = require('./modules/watchdog/blocks');
const processTransactionsFromQueue = require('./modules/watchdog/transactions');

const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const PORT = 4444;

let current_block;

const node = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

const Network = () => {
  const transactionQueue = [];

  const load = async () => {
    try {
      console.log('Network loaded. Starting block processing...');
      processBlockFromQueue(transactionQueue, node, io);
      processTransactionsFromQueue(transactionQueue, node, io);
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
