import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authroutes.js';
import contactRoutes from './routes/contactroutes.js';
import setupSocket from './socket.js';
import messageroutes from './routes/messageroutes.js';
import channelroutes from './routes/channelroutes.js';

dotenv.config();

const app = express();

// Middleware

app.use(express.json());
const corsOptions = {
  origin: 'https://chat-app-frontend-nine-tawny.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookieParser());


// Environment Variables
const port = process.env.PORT || 5000;
const databaseUrl = process.env.DATABASE_URL;
const dbName = process.env.DB_NAME;


app.use('/uploads',express.static('uploads'))
app.use('/uploads/files',express.static('uploads/files'))
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages",messageroutes);
app.use("/api/channel",channelroutes);

// Start Server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Setup Socket.IO
setupSocket(server);

// Connect to Database
mongoose.connect(`${databaseUrl}/${dbName}`)
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });
