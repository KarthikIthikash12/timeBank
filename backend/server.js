const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io'); 
require('dotenv').config(); 
const app = express(); 
const authRoutes = require('./routes/authRoutes'); 
const sessionRoutes = require('./routes/sessionRoutes'); 
const userRoutes = require('./routes/userRoutes'); 

app.use(cors());
app.use(express.json()); 
app.use('/api/auth', authRoutes); 
app.use('/api/sessions', sessionRoutes); 
app.use('/api/users', userRoutes); 

app.get('/api/test', (req, res) => {
    res.json({message: 'Timebank API is running smoothly dude'}); 
}); 
 
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_session", (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session room: ${sessionId}`);
  });
  socket.on("send_message", (data) => {
    socket.to(data.sessionId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB database");
        app.listen(PORT , () => {
            console.log(`Server is listening on port ${PORT}`); 
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message); 
    }); 
