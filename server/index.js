const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors")

// accessing the server from socket.io
const { Server } = require('socket.io')


app.use(cors())

// createing http server our Socket.io
const server = http.createServer(app);

// initiating the server with all the necessary things
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

// using the socket.io server to listen and emit all the event that is happening
io.on("connection", (socket) => {
    console.log(`user is conencted: ${socket.id}`)

    socket.on("join_room", (data)=>{
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })
    
    socket.on("send_message", (data)=>{  
        socket.to(data.room).emit("recieved_message", (data))
     })

    socket.on("disconnect", () => {
        console.log("user is disconnected", socket.id)
    })
})


server.listen(3001, () => {
    console.log("Server is running!")
});