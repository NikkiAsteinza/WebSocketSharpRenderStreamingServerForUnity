const wsUrl = 'ws://localhost:3000';
let ws;

const broadcastButton = document.getElementById("broadcastButton");
const receiverButton = document.getElementById("receiverButton");

broadcastButton.addEventListener('click', function() {
    window.location.href = '/broadcaster/main.html';
});

receiverButton.addEventListener('click', function() {
    window.location.href = '/receiver/main.html';
});

function initializeWebSocket() {
    ws = new WebSocket(wsUrl);

    ws.onopen = function() {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);

            if (message.id === 'webcomponent') {
                broadcastButton.disabled = true;
                receiverButton.disabled = true;
            }
            else if(message.id === 'UnityVR'){
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