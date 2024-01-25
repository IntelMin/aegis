const blockQueue = [];

async function processBlockFromQueue(transactionQueue, node, io) {
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

      // clear queue
      transactionQueue.splice(0, transactionQueue.length);

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

  node.on('block', async blockNumber => {
    blockQueue.push(blockNumber);
  });

  while (true) {
    if (blockQueue.length > 0) {
      const blockNumber = blockQueue.shift();
      await processBlock(blockNumber);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

module.exports = processBlockFromQueue;
