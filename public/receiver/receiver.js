let ws;

import {fetchConfig, getConfig} from '../config.js';

let config, targetChannel;
const inputSelector = document.getElementById("inputSelector");
inputSelector.addEventListener('change', function(){
    const seletorValue = inputSelector.value;
    console.log(seletorValue);
    targetChannel = seletorValue === 0? config.RECEIVER_CHANNEL: config.BROADCASTER_CHANNEL;
    console.log(targetChannel);
})



await fetchConfig();
config = getConfig();
targetChannel = config.RECEIVER_CHANNEL;

console.log(`Config: ${config}`);

function initializeWebSocket() {
    ws = new WebSocket(`ws://localhost:${config.PORT}`);

    ws.onopen = function() {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);

            if (message.id ===  targetChannel) {
                console.log("Unity message received");
                const base64Data = message.imageData;
                const imgWidth = message.width;
                const imgHeight = message.height;

                const imgElement = document.getElementById('image');
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');

                // Create an image object
                const img = new Image();
                img.onload = function() {
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;
                    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                    const imageData = canvas.toDataURL(config.IMAGE_FORMAT);
                    imgElement.src = imageData;
                    console.log('Image updated');
                };
                img.onerror = function() {
                    console.error('Image failed to load');
                };
                img.src = 'data:image/png;base64,' + base64Data;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    };

    ws.onerror = function(event) {
        console.error('WebSocket error:', event);
    };

    ws.onclose = function(event) {
        console.log('WebSocket connection closed', event);
        // Attempt to reconnect after a delay
        setTimeout(initializeWebSocket, 5000);
    };
}

window.onload = function() {
    initializeWebSocket();
};

window.onbeforeunload = function() {
    if (ws) {
        ws.onclose = function() {}; // Disable onclose handler first
        ws.close();
    }
};