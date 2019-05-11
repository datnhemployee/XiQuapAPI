module.exports = (socket,method,excution,sessionController) => {
    socket.on(Methods.LogIn, async function(data){
        let input = {...data};

        let output = await excution(input,sessionController,socket.id);
        
        socket.emit(method,output);
    })
}