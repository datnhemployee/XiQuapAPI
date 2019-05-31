const express = require("express");

const app = express();


const server = require('http').Server(app);
var io = require('socket.io')(server);

const port =  4000;
// const port = process.env.PORT || 4000;
server.listen(port);

const AuthController = require('./controller/AuthController');
const ItemController = require('./controller/ItemController');
const StockController = require('./controller/StockController');
const PhotoController = require('./controller/PhotoController');
const TypeController = require('./controller/TypeController');

// const seed = require('./Seed');

async function main () {
    // await seed.seed();
}

PhotoController.start(app);

main()
    .catch((reason)=>{
        console.log(`Reason: ${JSON.stringify(reason)}`)
    })
    .then(()=>{
        io.on(`connection`, function (socket){
            console.log('Co nguoi ket noi', socket.id, socket.handshake.url)
        
            AuthController.start(io,socket);
            ItemController.start(io,socket);
            StockController.start(io,socket);
            TypeController.start(io,socket);
        });
    });
