import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messagemodel.js";
import Channel from "./models/channelmodel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'https://chat-app-frontend-nine-tawny.vercel.app',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true
    }
  });

  const userSocketMap = new Map();

  const handleDisconnect = (socket) => {
    console.log(`User disconnected-${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {
      if (!message.sender) {
        throw new Error("Sender is required");
      }

      const senderSocketId = userSocketMap.get(message.sender.toString());
      const recipientSocketId = userSocketMap.get(message.recipient.toString());

      const createdMessage = await Message.create(message);
      const messageData = await Message.findById(createdMessage._id)
        .populate('sender', 'id email firstname lastname image color')
        .populate('recipient', 'id email firstname lastname image color');
      // console.log("Message Data:", messageData);
      // console.log("Sender Socket ID:", senderSocketId);
      // console.log("Recipient Socket ID:", recipientSocketId);
    
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receiveMessage', messageData);
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit('receiveMessage', messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendchannelmessage = async (message) => {
    const { channelid, sender, content, fileurl, messagetype } = message;
    
    const createdMessage = await Message.create({
      sender,
      content,
      fileurl,
      messagetype,
      timestamp: new Date()
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate('sender', 'id email firstname lastname image color')
      .exec();

    await Channel.findByIdAndUpdate(channelid, {
      $push: { messages: createdMessage._id }
    });

    const channel = await Channel.findById(channelid).populate('members');
    const finaldata = { ...messageData._doc, channelid: channel._id };
    
    console.log("Final Data:", finaldata);
    console.log("Channel Members:", channel.members);
    console.log("User Socket Map:", userSocketMap);

    if (channel && channel.members.length > 0) {
      for (const member of channel.members) {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          console.log("Member Socket ID:", memberSocketId);
          io.to(memberSocketId).emit('receivechannelmessage', finaldata);
        } else {
          console.log("Member Socket ID not found");
        }
      }
    }

    const adminSocketId = userSocketMap.get(channel.admin.toString());
    if (adminSocketId) {
      console.log("Admin Socket ID:", adminSocketId);
      io.to(adminSocketId).emit('receivechannelmessage', finaldata);
    } else {
      console.log("Admin Socket ID not found");
    }
  };

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId.toString(), socket.id);
      console.log(`User connected - ${userId}`);
    } else {
      console.log("User not connected");
    }

    socket.on('sendMessage', sendMessage);
    socket.on('sendchannelmessage', sendchannelmessage);
    socket.on("disconnect", () => handleDisconnect(socket));
  });
};

export default setupSocket;
