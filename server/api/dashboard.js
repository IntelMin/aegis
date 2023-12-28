const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const cron = require('node-cron');
const axios = require('axios');
require("dotenv").config({ path: "./../.env.local" });
const statsCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const calculateStats = () => {
    console.log('Calculating stats');
    let stats = {
        audits: 0,
        findings: 0,
        LOC: 0,
        functions: 0,
        liquidity: 0
    };

    const directories = fs.readdirSync(path.join(__dirname, '../data'));

    stats.audits = directories.length;

    directories.forEach(dir => {
        const findingsPath = path.join(__dirname, `/../cache/contracts/${dir}/findings.json`);
        const treePath = path.join(__dirname, `/../cache/contracts/${dir}/tree.json`);
        const securityPath = path.join(__dirname, `/../cache/contracts/${dir}/security.json`);
        console.log(findingsPath);
        if (fs.existsSync(findingsPath)) {

            const findings = JSON.parse(fs.readFileSync(findingsPath, 'utf8'));
            stats.findings += findings.length;
        }

        if (fs.existsSync(treePath)) {
            const tree = JSON.parse(fs.readFileSync(treePath, 'utf8'));
            tree.map(file => {
                stats.LOC += file.line;
                stats.functions += file.functions.length;
            })
        }

        if (fs.existsSync(securityPath)) {
            const security = JSON.parse(fs.readFileSync(securityPath, 'utf8'));
            stats.liquidity += security.liquidity;
        }
    });

    statsCache.set('stats', stats);
};

cron.schedule('0 * * * *', calculateStats);

router.get('/', (req, res) => {
    console.log("here")
    const stats = statsCache.get('stats');

    if (stats === undefined) {
        calculateStats();
        res.json(statsCache.get('stats'));
    } else {
        res.json(stats);
    }
});

router.get("/collections", (req, res) => {
    axios
        .post(
            "https://graph.defined.fi/graphql",
            {
                query: `{
                    getNetworks {
                    name
                    id
                    }
                }`
            }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.DEFINED_FI_API_KEY
            }
        }
        )
        .then((response) => {
            res.json(response.data)
        });
})


router.get("/top-tokens", (req, res) => {
    const { chain_id, limit, resolution } = req.query;
    axios
        .post(
            "https://graph.defined.fi/graphql",
            {
                query: `
                    query {
                        listTopTokens(
                            networkFilter: [${chain_id}]
                            limit: ${limit}
                            resolution: ${resolution}
                        ) {
                            name
                            symbol
                            address
                            volume
                            liquidity
                            marketCap
                            imageThumbUrl
                            imageSmallUrl
                            imageLargeUrl
                            price
                            priceChange
                            priceChange1
                            priceChange4
                            priceChange12
                            priceChange24
                            topPairId
                            exchanges {
                                name
                            }
                        }
                    }
                `
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": process.env.DEFINED_FI_API_KEY
                }
            }
        )
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("Internal Server Error");
        });
});

router.get("/get-sparkline", (req, res) => {
    const { token_id } = req.query;
    axios
        .post(
            "https://graph.defined.fi/graphql",
            {
                query: `{
                    tokenSparklines(input: { ids: ["${token_id}:1"] }) {
                      attribute
                      id
                      sparkline {
                        timestamp
                        value
                      }
                    }
                  }`
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": process.env.DEFINED_FI_API_KEY
                }
            }
        )
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("Internal Server Error");
        });
});


router.get("/searchTokens", (req, res) => {
    const { search } = req.query;
    axios
        .post(
            "https://graph.defined.fi/graphql",
            {
                query: `{
                    searchTokens(search:${search}){
                      tokens {
                        name
                        address
                        networkId
                      }
                    }
                }`
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": process.env.DEFINED_FI_API_KEY
                }
            }
        )
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("Internal Server Error");
        });
});

module.exports = router;