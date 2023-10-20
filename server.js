const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes')
const socket = require('socket.io')


const dotenv = require('dotenv')

dotenv.config();

const PORT = process.env.PORT || 5000

const app = express()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to mongo DB")
})
.catch(error => console.log(error))

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: " this is simple route"})
})

app.use('/api', routes)

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}` )
})

const io = socket(server, {
    cors: {
        origin: 'https://chat-node-api.onrender.com',
        // origin: 'http://localhost:8000',
        credentials: true
    }
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log("user socket ", userId, socket.id)
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log("DATA ", data)
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("Socket user ", sendUserSocket)
    if (sendUserSocket) {
      console.log("in side")
      socket.to(sendUserSocket.toString()).emit("msg-recieve", data.message);
    }
  });

  socket.on("user-typing", (data) => {
    console.log("is user typing")
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      console.log(data)
      socket.to(sendUserSocket.toString()).emit("isTyping", data)
    }
  })
});