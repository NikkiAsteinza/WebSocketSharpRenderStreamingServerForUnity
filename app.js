require('dotenv').config()
const express = require('express');
const http = require('http');
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

// Arguments
const argument = process.argv.slice(2);
const isSecureServer = argument == "secure";

const app = express();
const server = http.createServer(app);

const secureServer = https.createServer({
    cert: fs.readFileSync('client-1.local.crt'),
    key: fs.readFileSync('client-1.local.key')
  },app)

let currentServer = isSecureServer? secureServer : server ;

const wss = new WebSocket.Server({server: currentServer});

console.log("Custom Render Streaming Server for Unity - Nikki");

const runHelp = isSecureServer? 'start to go over http':'secure-start to go over https';
console.log(`Is secure server: \n- ${isSecureServer} (npm ${runHelp})`);

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

// Cors
app.use(cors());
// Routes
app.use(require('./routes/routes'));
// Static files
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        try {
            // Parse the incoming message
            const message = JSON.parse(data);
            const { id, width, height,imageData } = message;
            
            // Create a response message
            const responseMessage = {
                id: id,
                width:width,
                height:height,
                imageData: imageData // The imageData is already a base64 string
            };
            const responseData = JSON.stringify(responseMessage);

            // Broadcast the received data to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(responseData);
                }
            });
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Server starts listening
const targetPort = isSecureServer? process.env.SECURE_PORT : process.env.PORT;
currentServer.listen(targetPort, () => {
    console.log("Server is accessible at:");
    const connectionString =  isSecureServer? 'https':'http';
    console.log(`- ${connectionString}://localhost:${targetPort}`);
    for (const name of Object.keys(results)) {
        for (const address of results[name]) {
            console.log(`- ${connectionString}://${address}:${targetPort}`);
        }
    }
});