import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { useAppStore } from "@/store";
  import { CREATE_CHANNEL_ROUTES, GET_ALL_CONTACTS_ROUTES, HOST, SEARCH_CONTACT_ROUTES } from "@/utils/constants";
  import { getcolor } from "@/lib/utils";
  import { Avatar, AvatarImage } from "@/components/ui/avatar";
  import Lottie from "react-lottie";
  import { animationdefaultoptions } from "@/lib/utils";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import React, { useEffect, useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import { Input } from "@/components/ui/input";
  import apiclient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
  
  const CreateChannel = () => {
    const { setselectedchattype, setselectedchatdata, setselectedchatmessages ,addchannel} =
      useAppStore();
    const [newchannelmodel, setnewchannelmodel] = useState(false);
    const [searchedcontacts, setsearchedcontacts] = useState([]);
    const[allcontacts,setallcontacts]=useState([]);
    const[selectedcontacts,setselectedcontacts]=useState([]);
    const[channelname,setchannelname]=useState('');

    useEffect(() => { 
        const getdata = async () => {
            const response=await apiclient.get(GET_ALL_CONTACTS_ROUTES,{withCredentials:true});
            setallcontacts(response.data);

        }
        getdata();
      }, []);
  
    
  
   const createchannel=async()=>{
    try {
      if(channelname.length>0 && selectedcontacts.length>0){
      const response=await apiclient.post(CREATE_CHANNEL_ROUTES,{name:channelname,members:selectedcontacts},{withCredentials:true});
      if(response.status===200){
        addchannel(response.data.channel);
        
        
        
        setnewchannelmodel(false);
        setchannelname('');
        setselectedcontacts([]);
      }

    } }catch (error) {
      console.log(error)
      
    }

   }
  
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className="text-neutral-400 text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
                onClick={() => setnewchannelmodel(true)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none p-2 text-white text-sm">
              <p>create new channel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
  
        <Dialog open={newchannelmodel} onOpenChange={setnewchannelmodel}>
          <DialogContent className="bg-[#181920] border-none text-white w-[90vw] max-w-[400px] h-[400px] flex flex-col p-6">
            <DialogHeader>
              <DialogTitle className="text-lg text-center">
                Please fill up the details for new channel
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input
                placeholder="channel name"
                className="rounded-lg px-4 py-2 bg-[#2c2e3b] border-none text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setchannelname(e.target.value)}
                value={channelname}
              />
            </div>
            <div>
                <MultipleSelector
                className='rounded-lg bg-[32c2e3b] py-2 text-white'
                defaultOptions={allcontacts}
                placeholder='select contacts'
                value={selectedcontacts}
                onChange={(value)=>setselectedcontacts(value)}
                emptyIndicator={
                   <p className="text-center text-lg leading-10 text-grey-600"> no contacts found</p>
                }
                />
            </div>
            <div>
                <Button className='w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300' onClick={createchannel}>create channel</Button>
            </div>
            
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  export default CreateChannel;
  