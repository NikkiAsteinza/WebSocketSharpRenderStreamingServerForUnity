const https = require('https');
const fs = require('fs'); // For loading SSL certificates if using HTTPS

function getSecureServer(app){
    // Specify your SSL options if using HTTPS
    const options = {
        key: fs.readFileSync('server-key.pem'),
        cert: fs.readFileSync('server-cert.pem')
    };
    const server = https.createServer(options, app);
    return server;
}

module.exports = { getSecureServer };