const express = require("express");

const app = express();

const server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);
const MESSAGE = require('./constant/Message');
const AuthController = require('./controller/AuthController');

const seed = require('./Seed');

// seed.seed();
// io.on(MESSAGE.CONNECTION, function (socket){
//     console.log('Co nguoi ket noi', socket.id)

//     socket.on('register', function(data){
//         AuthController
//     })
// })


AuthController.start(io);



