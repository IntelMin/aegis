const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/pair', async (req, res) => {
  const { q } = req.query;
  console.log('query', q);

  const { CurlImpersonate } = require('node-curl-impersonate');

  const url = `https://io.dexscreener.com/dex/search/v3/pairs?q=${q}`;
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    impersonate: 'chrome-110',
    verbose: false,
  };

  const curl = new CurlImpersonate(url, options);

  curl
    .makeRequest()
    .then(response => {
      // console.log('Raw Response:', response.response);
      //   console.log('Response Headers:', response.responseHeaders);
      //   console.log('Content Type:', response.responseHeaders['content-type']);
      //   console.log(
      //     'Content Encoding:',
      //     response.responseHeaders['content-encoding']
      //   );

      binary = response.response;

      let raw_output = '';

      for (let i = 0; i < binary.length; i++) {
        let charCode = binary.charCodeAt(i);

        raw_output += `0x${charCode
          .toString(16)
          .padStart(2, '0')}\t${charCode}\t\t${binary[i]}\n`;
      }

      fs.writeFileSync('test.raw', raw_output);

      function parseBinary(binary) {
        let binaryData = Buffer.isBuffer(binary)
          ? binaryData
          : Buffer.from(binary);

        let processed = [];
        let index = 0;

        function readByte() {
          return binaryData.readUInt8(index++);
        }

        function readInt() {
          let byte = readByte();
          console.log('byte:', byte);
          // convert byte to decimal
          let dec = byte.toString(10);
          return dec;
        }

        function readString() {
          let length = readInt();
          length = length / 2;

          console.log('strlen:', length);
          let str = '';
          for (let i = 0; i < length; i++) {
            str += String.fromCharCode(readByte());
          }
          return str;
        }

        function readArrayLen() {
          let sizeLength = readByte();
          sizeLength = sizeLength / 2;
          console.log('sizeLength:', sizeLength);
          let arrayLength = 0;

          readByte();

          return sizeLength;
        }

        function readToken() {
          const address = readString();
          console.log('address:', address);

          const name = readString();
          console.log('name:', name);

          const symbol = readString();
          console.log('symbol:', symbol);

          return { address, name, symbol };
        }

        function readTransactions() {
          return {
            m5: {
              buys: readInt(),
              sells: readInt(),
            },
            h1: {
              buys: readInt(),
              sells: readInt(),
            },
            h6: {
              buys: readInt(),
              sells: readInt(),
            },
            h24: {
              buys: readInt(),
              sells: readInt(),
            },
          };
        }

        while (index < binaryData.length) {
          // schemaVersion
          let schemaVersion = readString();
          processed.push({ schemaVersion });
          console.log('schemaVersion:', schemaVersion);

          // PairData
          const arrayLength = readArrayLen();
          console.log('arrayLength:', arrayLength);

          let dataArray = [];
          for (let i = 0; i < arrayLength; i++) {
            let chainId = readString();
            processed.push({ chainId });
            console.log('chainId:', chainId);

            let dexId = readString();
            processed.push({ dexId });
            console.log('dexId:', dexId);

            const labels = readArrayLen();
            console.log('labels:', labels);

            const version = readString();
            console.log('version:', version);

            const pairAddress = readString();
            console.log('pairAddress:', pairAddress);

            const baseToken = readToken();
            console.log('baseToken:', baseToken);

            const quoteToken = readToken();
            console.log('quoteToken:', quoteToken);

            const quoteTokenSymbol = readString();
            console.log('quoteTokenSymbol:', quoteTokenSymbol);

            const price = readString();
            console.log('price:', price);

            readByte();

            const priceUSD = readString();
            console.log('priceUSD:', priceUSD);

            const transactions = readTransactions();
            console.log('transactions:', transactions);

            break;

            // let dexId = readString();
            // processed.push({ dexId });
            // console.log('dexId:', dexId);

            dataArray.push(readString());
            break;
          }
          break;
          processed.push({ dataArray });
        }

        return processed;
      }

      let processed = parseBinary(binary);
      console.log(processed);

      console.log('a_processed', processed.join('\n'));

      res.status(200).send(processed);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;
