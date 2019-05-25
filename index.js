const express = require("express");

const app = express();

const server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);
const AuthController = require('./controller/AuthController');
const ItemController = require('./controller/ItemController');
const StockController = require('./controller/StockController');

const seed = require('./Seed');

async function main () {
    await seed.seed();
}

main()
    .catch((reason)=>{
        console.log(`Reason: ${JSON.stringify(reason)}`)
    })
    .then(()=>{
        io.on(`connection`, function (socket){
            console.log('Co nguoi ket noi', socket.id)
        
            AuthController.start(io,socket);
            ItemController.start(io,socket);
            StockController.start(io,socket);
        });
    });
