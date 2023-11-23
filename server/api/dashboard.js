const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const cron = require('node-cron');

const statsCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const calculateStats = () => {
    let stats = {
        audits: 0,
        findings: 0,
        LOC: 0,
        functions: 0,
        liquidity: 0
    };

    const directories = fs.readdirSync('./data/');

    stats.audits = directories.length;

    directories.forEach(dir => {
        const findingsPath = path.join(__dirname,`../data/${dir}/findings.json`);
        const treePath = path.join(__dirname,`../data/${dir}/tree.json`);
        const securityPath = path.join(__dirname,`../data/${dir}/security.json`);
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

router.get('/:address', (req, res) => {
    const stats = statsCache.get('stats');

    if (stats === undefined) {
        calculateStats();
        res.json(statsCache.get('stats'));
    } else {
        res.json(stats);
    }
});

module.exports = router;