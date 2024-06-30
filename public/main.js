import {fetchConfig, getConfig} from '../config.js';

let config,ws;

await fetchConfig();
config = getConfig();

const broadcastButton = document.getElementById("broadcastButton");
const receiverButton = document.getElementById("receiverButton");

broadcastButton.addEventListener('click', function() {
    window.location.href = '/broadcaster/main.html';
});

receiverButton.addEventListener('click', function() {
    window.location.href = '/receiver/main.html';
});

function initializeWebSocket() {
    ws = new WebSocket(`ws://localhost:${config.PORT}`);

    ws.onopen = function() {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);

            if (message.id === config.BROADCASTER_CHANNEL) {
                broadcastButton.disabled = true;
                receiverButton.disabled = false;
            }
            else if(message.id === config.RECEIVER_CHANNEL){
                receiverButton.disabled = false;
            }
            else
            {
                broadcastButton.disabled = false;
                receiverButton.disabled = false;
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