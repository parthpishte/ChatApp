import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { getcolor } from "@/lib/utils";
import { HOST, LOGOUT_ROUTES } from "@/utils/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import apiclient from "@/lib/api-client";
import { toast } from "sonner";

const ProfileInfo = () => {
  const { userinfo,setuserinfo } = useAppStore();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response=await apiclient.get(LOGOUT_ROUTES,{withCredentials:true});
      if(response.status===200){
        toast.success("Logged out successfully");
        setuserinfo({});
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="absolute bottom-0 flex items-center justify-between w-full px-6 py-4 bg-[#2a2b33]">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12">
          <Avatar className="w-12 h-12 overflow-hidden rounded-full">
            {userinfo.image ? (
              <AvatarImage
                src={`${HOST}/${userinfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase w-12 h-12 text-lg border flex items-center justify-center rounded-full ${getcolor(
                  userinfo.color
                )}`}
              >
                {userinfo.firstname
                  ? userinfo.firstname.charAt(0)
                  : userinfo.email
                  ? userinfo.email.charAt(0)
                  : "U"}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-white">
          {userinfo.firstname && userinfo.lastname
            ? `${userinfo.firstname} ${userinfo.lastname}`
            : ""}
        </div>
      </div>

      <div className="flex gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-xl font-medium text-purple-500 cursor-pointer"
                onClick={() => navigate('/profile')}
              />
            </TooltipTrigger>
            <TooltipContent className="text-white bg-[#1c1b1e] border-none">
              <p>Edit profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-xl font-medium text-red-500 cursor-pointer"
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent className="text-white bg-[#1c1b1e] border-none">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;