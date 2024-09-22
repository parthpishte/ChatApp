import { RiCloseFill } from 'react-icons/ri';
import { useAppStore } from '@/store';
import { getcolor } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";

const ChatHeader = () => {
  const { closechat, selectedchatdata, selectedchattype } = useAppStore();

  return (
    <div className="flex items-center justify-between h-[10vh] border-b-2 border-[#2f303b] px-4 md:px-8 bg-[#1c1d25]">
      
      <div className="flex items-center gap-4">
        
        <div className="relative w-12 h-12">
          {
            selectedchattype==='contact' ?  <Avatar className="w-12 h-12 overflow-hidden rounded-full">

            {selectedchatdata && selectedchatdata.image ? (
              <AvatarImage
                src={`${HOST}/${selectedchatdata.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase w-12 h-12 text-lg border flex items-center justify-center rounded-full ${getcolor(
                  selectedchatdata?.color
                )}`}
              >
                {selectedchatdata?.firstname
                  ? selectedchatdata.firstname.charAt(0)
                  : selectedchatdata?.email
                  ? selectedchatdata.email.charAt(0)
                  : "U"}
              </div>
            )}
          </Avatar>:<div className=' bg-white h-10 w-10 flex items-center justify-center rounded-full'>#</div>
          }
         
        </div>

        
        <div className="text-white text-lg font-semibold">
          {selectedchattype === 'channel' && selectedchatdata?.name}
          {selectedchattype === 'contact' && selectedchatdata?.firstname
            ? `${selectedchatdata.firstname} ${selectedchatdata.lastname}`
            : selectedchatdata?.email}
        </div>
      </div>

      
      <div className="flex items-center justify-center">
        <button
          className="text-3xl text-neutral-300 hover:text-white transition-all duration-300 focus:outline-none"
          onClick={closechat}
        >
          <RiCloseFill />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
