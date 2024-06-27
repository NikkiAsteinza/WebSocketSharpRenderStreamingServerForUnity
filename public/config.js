let broadcastingImageWidth, broadcastingImageHeight, broadcastingImageFormat, broadcasterReceiver;

// Recover image sizes from the server
async function fetchConfig() {
    return fetch('/getConfig')
        .then(response => response.json())
        .then(config => {
            console.log('Broadcasting image size:', config);
            broadcastingImageWidth = config.width;
            broadcastingImageHeight = config.height;
            broadcastingImageFormat = config.format;
            broadcasterReceiver = config.broadcasterReceiver;
        })
        .catch(error => console.error('Error fetching config:', error));
}

// Getter functions to access updated values
function getBroadcastingImageWidth() {
    return broadcastingImageWidth;
}

function getBroadcastingImageHeight() {
    return broadcastingImageHeight;
}

function getBroadcastingImageFormat() {
    return broadcastingImageFormat;
}

export { fetchConfig, getBroadcastingImageWidth, getBroadcastingImageHeight, getBroadcastingImageFormat };