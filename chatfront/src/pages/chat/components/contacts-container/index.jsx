import apiclient from "@/lib/api-client";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profileinfo";
import { useEffect } from "react";
import CreateChannel from "./components/create-channel";
import { GET_DM_CONTACTS_ROUTES,GET_USER_CHANNELS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactsList from "@/components/ui/contactslist";
const ContactsContainer = () => {
  const{setdirectmessagescontacts,directmessagescontacts,channels,setchannels}=useAppStore()
  useEffect(() => {
    const getContacts = async () => {
      try {
       // console.log("Fetching contacts from:", GET_DM_CONTACTS_ROUTES);
        const response = await apiclient.get(GET_DM_CONTACTS_ROUTES, {
          withCredentials: true
        });
       // console.log("Response received:", response);
        if (response.status === 200) {
          setdirectmessagescontacts(response.data);
         // console.log("Contacts data:", response.data);
        } else {
          console.error("Failed to fetch contacts, status code:", response.status);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    const getuserchannels = async () => {
      try {
          const response = await apiclient.get(GET_USER_CHANNELS_ROUTES, {withCredentials:true});
        if (response.status === 200) {
           setchannels(response.data.channels);
        }
        
        
         else {
          console.error("Failed to fetch user channels, status code:", response.status);
        }
      
      } catch (error) {
        console.error("Error fetching user channels:", error);
      }
    };

    getContacts();
    getuserchannels();
  }, []);
  return (
    <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-gray-700 border-r-2 border-gray-700 z-50">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM/>
        </div>
       <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
        <ContactsList contacts={directmessagescontacts}/>

        </div> 
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel/>
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
        <ContactsList contacts={channels} ischannel={true}/>

        </div> 
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex items-center justify-start gap-2 p-5">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
  d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
  className="ccustom"
  fill="#FFA500"  // Orange
></path>
<path
  d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
  className="ccompli1"
  fill="#FFFFFF"  // White
></path>
<path
  d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
  className="ccompli2"
  fill="#008000"  // Green
></path>
      </svg>
      <span className="text-3xl font-semibold text-green">Alienware</span>
    </div>
  );
};

export { Logo };

const Title = ({ text }) => {
  return (
    <h6 className="pl-10 text-sm font-light tracking-widest text-gray-400 uppercase">
      {text}
    </h6>
  );
};