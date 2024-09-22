import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container/index";
import ContactsContainer from "./components/contacts-container/index";
import EmptyChatContainer from "./components/emptychat-container/index";

const Chat = () => {
  
  const { userinfo,selectedchattype,selectedchatdata,selectedchatmessages, isuploading,
    isdownloading,
    fileuploadprogress,
    filedownloadprogress}=useAppStore() 
  const navigate = useNavigate();
 // console.log(userinfo);

  useEffect(() => {
    if (userinfo && userinfo.profilesetup === false) {
      toast.error('Please setup your profile');
      navigate('/profile');
    }
  }, [userinfo, navigate]);

  return (
    <div className="flex h-[100vh] text-black overflow-hidden">
      {
        isuploading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">uploading files</h5>
          {
            fileuploadprogress 
          }%
        </div>
      } 
      {
        isdownloading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">downloading files</h5>
          {
            filedownloadprogress 
          }%
        </div>
      } 
      <ContactsContainer />
      {
        selectedchattype==undefined ? <EmptyChatContainer /> : <ChatContainer />
      }
     
    </div>
  );
};

export default Chat;