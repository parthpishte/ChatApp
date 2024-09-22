import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store';
import moment from 'moment/moment';
import apiclient from "@/lib/api-client";
import { GET_ALL_MESSAGES_ROUTES, GET_CHANNEL_MESSAGES_ROUTES, HOST } from '@/utils/constants';
import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { getcolor } from "@/lib/utils";
import { AvatarFallback } from '@radix-ui/react-avatar';


const MessageContainer = () => {
  const scrollref = useRef();
  const { selectedchattype, selectedchatdata, selectedchatmessages, addmessage, userinfo, setselectedchatmessages ,isdownloading,setfiledownloadprogress,setisdownloading} = useAppStore();
  const [showimage, setshowimage] = useState(false);
  const [imageurl, setimageurl] = useState(null);

  useEffect(() => {
    const getmessage = async () => {
      try {
        const response = await apiclient.post(
          GET_ALL_MESSAGES_ROUTES,
          { id: selectedchatdata._id },
          { withCredentials: true }
        );
        if (response.data) {
          setselectedchatmessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getchannelmessages = async () => {
      try {
        const response = await apiclient.get(
          `${GET_CHANNEL_MESSAGES_ROUTES}/${selectedchatdata._id}`,
          
          { withCredentials: true }
        ); 
        if (response.data.messages) {
          setselectedchatmessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
        
      }
    }

    if (selectedchatdata._id && selectedchattype === 'contact') {
      getmessage();
    }
    else if (selectedchatdata._id && selectedchattype === 'channel') {
      getchannelmessages();
    }
  }, [selectedchatdata, selectedchattype, setselectedchatmessages]);

  useEffect(() => {
    if (scrollref.current) {
      scrollref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedchatmessages]);

  const checkifimage = (filepath) => {
    const imageregex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
    return imageregex.test(filepath);
  };

  const renderMessages = () => {
    let lastdate = null;
    return selectedchatmessages.map((message) => {
      const messagedate = moment(message.createdAt).format('YYYY-MM-DD');
      const showdate = messagedate !== lastdate;
      lastdate = messagedate;
      return (
        <div key={message._id}>
          {showdate && <div className="text-center text-gray-500 my-2">{moment(message.createdAt).format('LL')}</div>}
          {selectedchattype === 'contact' && renderdmmessage(message)}
          {selectedchattype === 'channel' && renderchannelmessage(message)}
        </div>
      );
    });
  };

  const renderdmmessage = (message) => {
  //   console.log("Message:", message);
  //   console.log("Message Sender ID:", message.sender);
  // console.log("Current User ID:", userinfo._id);
  // console.log("Is current user:", message.sender === userinfo._id);
    return (
      <div className={`${message.sender !== userinfo._id ? 'text-left' : 'text-right'}`}>
        {message.messagetype === 'text' && (
          <div
            className={`${
              message.sender !== userinfo._id
                ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
                : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messagetype === 'file' && (
          <div
            className={`${
              message.sender !== userinfo._id
                ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
                : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkifimage(message.fileurl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setshowimage(true);
                  setimageurl(message.fileurl);
                }}
              >
                <img src={`${HOST}/${message.fileurl}`} className="h-60 w-60 object-cover" alt="message-file" />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#8417ff] text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileurl.split('/').pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadfile(message.fileurl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">{moment(message.createdAt).format('LT')}</div>
      </div>
    );
  };
  const renderchannelmessage = (message) => {
     console.log("Message:", message);
    return(
      <>
      
      <div className={`mt-5 ${message.sender._id!==userinfo._id ? 'text-left' :'text-right'} `}>
       {message.messagetype === 'text' && (
          <div
            className={`${
              message.sender._id !== userinfo._id
                ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
                : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
         {message.messagetype === 'file' && (
          <div
            className={`${
              message.sender._id === userinfo._id
                ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
                : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkifimage(message.fileurl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setshowimage(true);
                  setimageurl(message.fileurl);
                }}
              >
                <img src={`${HOST}/${message.fileurl}`} className="h-60 w-60 object-cover" alt="message-file" />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#8417ff] text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileurl.split('/').pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadfile(message.fileurl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {
          message.sender._id !== userinfo._id ? <div className='flex items-center justify-start gap-3'>
            <Avatar className="w-8 h-8 overflow-hidden rounded-full">

{message.sender && message.sender.image && (
  <AvatarImage
    src={`${HOST}/${message.sender.image}`}
    alt="profile"
    className="object-cover w-full h-full bg-black"
  />
)}
  <AvatarFallback
    className={`uppercase w-8 h-8 text-lg  flex items-center justify-center rounded-full ${getcolor(
      message.sender?.color
    )}`}
  >
    {
      message.sender?.firstname
      ? message.sender.firstname
      : message.sender?.email
      ? message.sender.email
      : "U"
    }
  </AvatarFallback>

</Avatar>
<span className='text-sm text-white/60 '>{`${message.sender.firstname} ${message.sender.lastname}`}</span>
<span className='text-xs text-white/60'>{
  moment(message.timestamp).format('LT')
}</span>
          </div>:<div className='text-xs text-white/60 mt-1'>{
  moment(message.timestamp).format('LT') 
}</div>
        }
      </div>
      </>
    )
  }

  const downloadfile = async (url) => {
    setisdownloading(true);
    setfiledownloadprogress(0);
    const response = await apiclient.get(`${HOST}/${url}`, {
      responseType: 'blob',
      onDownloadProgress: (data) => {
        setfiledownloadprogress(Math.round((100 * data.loaded) / data.total));
      },
    });
    const urlblob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlblob;
    link.setAttribute('download', url.split('/').pop());
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(urlblob);
    setisdownloading(false);
    setfiledownloadprogress(0);
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
        {renderMessages()}
        <div ref={scrollref} />
        {showimage && (
          <div className="fixed z-[1000] top-0 left-0 h-screen w-screen flex items-center justify-center backdrop-blur-lg">
            <div>
              <img src={`${HOST}/${imageurl}`} className="h-[80vh] w-auto object-contain" alt="selected" />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
              <button
                className="bg-white p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadfile(imageurl)}
              >
                <IoMdArrowRoundDown />
              </button>
              <button
                className="bg-white p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  setshowimage(false);
                  setimageurl(null);
                }}
              >
                <IoCloseSharp />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageContainer;
