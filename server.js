require('dotenv').config();

const http = require('http');

function getServer(app){
    const server = http.createServer(app);
    return server;
}

module.exports = { getServer };