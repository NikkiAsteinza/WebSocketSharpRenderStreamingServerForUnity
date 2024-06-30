require('dotenv').config()
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Arguments
const argument = process.argv.slice(2);
const isSecureServer = argument == "secure";
console.log(`Is secure server ${isSecureServer}`);

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