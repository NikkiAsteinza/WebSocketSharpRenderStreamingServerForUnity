import {getRunningServer} from './main.js';

const WebSocket = require('ws');
const server = getRunningServer();
const wss = new WebSocket.Server({ server });

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