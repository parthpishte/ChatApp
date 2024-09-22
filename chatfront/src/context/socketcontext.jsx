import { createContext, useEffect, useRef, useContext } from "react";
import { useAppStore } from "../store";
import { io } from "socket.io-client";
import { HOST } from "../utils/constants";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
 // const { userinfo } = useAppStore();
  const { userinfo } = useAppStore();  

  useEffect(() => {
    if (userinfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: userinfo._id,
        },
        extraHeaders: {
          "Access-Control-Allow-Origin": "https://chat-app-frontend-blue.vercel.app"
      }
      });

      socket.current.on("connect", () => {
        console.log("Socket connected");
      });

     
      const handleReceiveMessage = (message) => {
       const {selectedchatdata, selectedchattype, addmessage,addcontactsindmcontacts } = useAppStore.getState();  
        console.log("Received message:", message);
        console.log("Selected Chat Type:", selectedchattype);
        console.log("Selected Chat Data:", selectedchatdata);

        if (
          selectedchattype !== undefined &&
          
          (selectedchatdata._id === message.sender._id || selectedchatdata._id === message.recipient._id)
        ) {
          console.log("Adding message to chat");
          addmessage(message);
         // addcontactsindmcontacts(message);
        } else {
          console.log("Message does not belong to the selected chat");
        }
        addcontactsindmcontacts(message);
      };
      const handleReceivechannelMessage=(message)=>{
        const {selectedchatdata, selectedchattype, addmessage,addchanneltochannellist } = useAppStore.getState();  
        if(selectedchattype !== undefined && selectedchatdata._id === message.channelid ){
          addmessage(message);
        }
        addchanneltochannellist(message);

      }

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receivechannelmessage", handleReceivechannelMessage);

      return () => {
       
          socket.current.disconnect();
        
      };
    }
  }, [userinfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};