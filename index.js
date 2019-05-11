const express = require("express");

const app = express();

const server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);
const AuthController = require('./controller/AuthController');
const ExchangeController = require('./controller/ExchangeController');
const StockController = require('./controller/StockController');

const seed = require('./Seed');
seed.seed();

let SessionController = {
    list: []
};

const Methods = {
    Connection: 'connection',
}

io.of().on(Methods.Connection, function (socket){
    console.log('Co nguoi ket noi', socket.id)

    AuthController.start(socket,SessionController);
    ExchangeController.start(socket,SessionController);
    // StockController.start(socket,SessionController);
});
