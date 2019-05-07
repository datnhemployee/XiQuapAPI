const express = require("express");

const app = express();

const server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

const controller = require('./controller/main');

controller(io);



