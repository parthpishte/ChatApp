


export const createChatSlice = (set, get) => ({
    selectedchattype: undefined,
    selectedchatdata: undefined,
    selectedchatmessages: [],
    isuploading: false,
    isdownloading: false,
    fileuploadprogress: 0,
    filedownloadprogress: 0,
    directmessagescontacts: [],
    channels:[],
    setchannels:(channels)=>set({channels}),
    setisuploading: (isuploading) => set({ isuploading }),
    setisdownloading: (isdownloading) => set({ isdownloading }),
    setfileuploadprogress: (fileuploadprogress) => set({ fileuploadprogress }),
    setfiledownloadprogress: (filedownloadprogress) => set({ filedownloadprogress }),
    setdirectmessagescontacts: (directmessagescontacts) => set({ directmessagescontacts }),
  
    
    setselectedchattype: (selectedchattype) => set({ selectedchattype }),
  
    
    setselectedchatdata: (selectedchatdata) => set({ selectedchatdata }),
  
    
    setselectedchatmessages: (selectedchatmessages) => set({ selectedchatmessages }),
  
    addchannel: (channel) => {
const channels = get().channels;
set({ channels: [...channels, channel] });
    },
    
    closechat: () => set({
      selectedchattype: undefined,
      selectedchatdata: undefined,
      selectedchatmessages: []
    }),
  
    
    addmessage: (message) => {
      const selectedchatmessages = get().selectedchatmessages;
      const selectedchattype = get().selectedchattype;
  
      set({
        selectedchatmessages: [
          ...selectedchatmessages,
          {
            ...message,
            recipient: selectedchattype === 'channel' ? message.recipient : message.recipient._id,
            sender: selectedchattype === 'channel' ? message.sender : message.sender._id,
          }
        ]
      });
    },
    addchanneltochannellist:(message)=>{
      const channels = get().channels;
      const data=channels.find(channel=>channel._id===message.channelid);
       const index=channels.findIndex(channel=>channel._id===message.channelid);
       if(index!==-1 && index!==undefined){
        channels.splice(index,1);
        channels.unshift(data);
       }
    },
    addcontactsindmcontacts:(message)=>{
      const userid=get().userinfo._id;
      const fromid=message.sender._id===userid?message.recipient._id:message.sender._id;
      const fromdata=message.sender._id===userid?message.recipient:message.sender;
      const dmcontacts=get().directmessagescontacts
      const data=dmcontacts.find(contact=>contact._id===fromid);
      const index=dmcontacts.findIndex(contact=>contact._id===fromid);
      if(index!==-1 && index!==undefined){
        dmcontacts.splice(index,1);
        dmcontacts.unshift(data);
    }
    else{
      dmcontacts.unshift(fromdata);
    }
    set({directmessagescontacts:dmcontacts});
  }
  });