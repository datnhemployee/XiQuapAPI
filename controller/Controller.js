exports.on_emit = (socket,method,excution) => {
    socket.on(method, async function(data){
        let input = {...data};

        let output = await excution(input,socket);
        
        console.log(`output: ${method} ${JSON.stringify(output)}`)
        socket.emit(method,output);
    })
}

exports.on_emitAll = (io,socket,method,excution) => {
    socket.on(method, async function(data){
        let input = {...data};

        let output = await excution(input,socket);
        
        console.log(`output: ${method} ${JSON.stringify(output)}`)
        io.sockets.emit(method,output);
    })
}