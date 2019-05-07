const authController = require('./AuthController');
module.exports = function (io) {
    authController.run(io);
    
    io.on("connection", function (socket){
        console.log('Co nguoi ket noi', socket.id)
        socket.on('logIn', function(data){
            console.log(JSON.stringify(data))
        })
    })
}