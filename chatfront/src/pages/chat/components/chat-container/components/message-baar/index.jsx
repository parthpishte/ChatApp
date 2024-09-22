import React, { useState, useRef, useEffect } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from '@/store';
import { useSocket } from '@/context/socketcontext.jsx';
import apiclient from '@/lib/api-client';
import { UPLOAD_FILE_ROUTES } from '@/utils/constants';


const MessageBar = () => {
  const fileinputref=useRef();
  const [message, setMessage] = useState('');
  const [emojipickeropen, setemojipickeropen] = useState(false);
  const emojiref = useRef();
  const socket = useSocket();
  const { selectedchattype, selectedchatdata, selectedchatmessages, addmessage, userinfo,setisuploading,setisdownloading,setfileuploadprogress,setfiledownloadprogress} = useAppStore();

  useEffect(() => {
    function handleclickoutside(event) {
      if (emojiref.current && !emojiref.current.contains(event.target)) {
        setemojipickeropen(false);
      }
    }
    document.addEventListener('mousedown', handleclickoutside);
    return () => {
      document.removeEventListener('mousedown', handleclickoutside);
    };
  }, []);

  const handleSendMessage = () => {
   // console.log(selectedchattype)
    // console.log('Socket:', socket);
    // console.log('User Info:', userinfo);
    // console.log('Selected Chat Data:', selectedchatdata);
    // console.log('Message:', message);
     if(selectedchattype==='contact'){
    if (socket && socket.connected && userinfo && selectedchatdata && message) {
      socket.emit("sendMessage", {
        sender: userinfo._id,
        content: message,
        recipient: selectedchatdata._id,
        messagetype: 'text',
        fileurl: undefined
      });
      setMessage('');
      
    } else {
      console.error('Missing required data to send message or socket not connected');
    }
  }
  else if(selectedchattype==='channel'){
    //console.log("sending message to channel");
    if(socket && socket.connected && userinfo && selectedchatdata && message ){
    socket.emit('sendchannelmessage',{
       sender: userinfo._id,
        content: message,
        messagetype: 'text',
        fileurl: undefined,
        channelid:selectedchatdata._id
    })
  }
  else {
    console.error('Missing required data to send message or socket not connected');
  }
  }

}
  ;
  const handleattachmentchange = async(event) => {
try {
  const file=event.target.files[0];
  console.log(file);
  if(file){
    const formdata=new FormData();
    formdata.append('file',file);
    setisuploading(true);
    const response=await apiclient.post(UPLOAD_FILE_ROUTES,formdata,{
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials:true,
      onUploadProgress:data=>{
        setfileuploadprogress(Math.round((100*data.loaded)/data.total));
      }
    })
    if(response.status==200){
      setisuploading(false);
      if(selectedchattype=='contact'){
      socket.emit("sendMessage", {
        sender: userinfo._id,
        content: undefined,
        recipient: selectedchatdata._id,
        messagetype: 'file',
        fileurl: response.data.filepath,
      })
      setMessage('');
    }
    else if(selectedchattype=='channel'){
      socket.emit('sendchannelmessage',{
        sender: userinfo._id,
          content: undefined,
          
          messagetype: 'file',
          fileurl: response.data.filepath,
          channelid:selectedchatdata._id
      })
    }
    setMessage('');
  }
}

} catch (error) {
  setisuploading(false);
  console.log(error);
}
  }

  const handleattachmentclick = () => {
    if(fileinputref.current){
      fileinputref.current.click();
    }
  }

  const handleemoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center px-4 md:px-8 mb-6 gap-4 md:gap-6 w-full max-w-full">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-4 md:gap-5 pr-4 md:pr-5">
        <input
          type="text"
          className="flex-1 p-4 md:p-5 bg-transparent rounded-md focus:outline-none text-white"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 transition-all duration-300 focus:outline-none focus:text-white" onClick={handleattachmentclick}>
          <GrAttachment className="text-2xl" />
        </button>
        <input type='file' className='hidden' ref={fileinputref} onChange={handleattachmentchange}></input>
        <div className="relative">
          <button
            className="text-neutral-500 transition-all duration-300 focus:outline-none focus:text-white"
            onClick={() => setemojipickeropen(!emojipickeropen)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojipickeropen && (
            <div className="absolute bottom-16 right-0 z-10" ref={emojiref}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleemoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      
      <button
        className="text-neutral-500 transition-all duration-300 focus:outline-none focus:text-white"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;