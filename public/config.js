let config

// Recover configuration from the server
async function fetchConfig() {
    return fetch('/getConfig')
        .then(response => response.json())
        .then(data => {
            console.log('Streaming config:', data);
            config = data;
        })
        .catch(error => console.error('Error fetching config:', error));
}

// Getter functions to access updated values
function getConfig() {
    return config;
}

export { fetchConfig, getConfig };