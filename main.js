const { getServer } = require('./server.js');
const { getSecureServer } = require('./secure-server.js');

const express = require('express');
const app = express();
const argument = process.argv.slice(2);
const cors = require('cors')
const path = require('path') // Serve static files

// Arguments
console.log('Arguments:', argument);
const isSecureServer = argument == "secure";

const server = isSecureServer?
    getSecureServer(app): getServer(app);

//Get local ip address
'use strict';

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

// Middleware to redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});

// Cors
app.use(cors());

// Public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getConfig', (req, res) => {
    res.json({
        width: process.env.BROADCASTING_WIDTH,
        height: process.env.BROADCASTING_HEIGHT,
        format: process.env.IMAGE_FORMAT,
        broadcastChannel: process.env.RECEIVER_CHANNEL
    });
});

// Server starts listening
if(isSecureServer){
    httpsServer.listen(process.env.SECURE_PORT, () => {
        console.log(`Server is accessible at http://${address}:${process.env.SECURE_PORT}`);
    });
}
else{
    server.listen(process.env.PORT, () => {
        for (const name of Object.keys(results)) {
            for (const address of results[name]) {
                console.log(`Server is accessible at http://${address}:${process.env.PORT}`);
            }
        }
    });
}


function getRunningServer(){
    return server;
}

module.exports = { getRunningServer };