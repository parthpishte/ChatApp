import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/store";
import { HOST, SEARCH_CONTACT_ROUTES } from "@/utils/constants";
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
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import apiclient from "@/lib/api-client";

const NewDM = () => {
  const { setselectedchattype, setselectedchatdata, setselectedchatmessages } =
    useAppStore();
  const [opennewcontack, setopennewcontack] = useState(false);
  const [searchedcontacts, setsearchedcontacts] = useState([]);

  const searchcontacts = async (searchterm) => {
    try {
      if (searchterm.length > 0) {
        const response = await apiclient.post(
          SEARCH_CONTACT_ROUTES,
          { searchterm },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setsearchedcontacts(response.data);
        }
      } else {
        setsearchedcontacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectnewcontact = (contact) => {
    setopennewcontack(false);
    setselectedchattype("contact");
    setselectedchatdata(contact);
    setsearchedcontacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setopennewcontack(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none p-2 text-white text-sm">
            <p>Select a new contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={opennewcontack} onOpenChange={setopennewcontack}>
        <DialogContent className="bg-[#181920] border-none text-white w-[90vw] max-w-[400px] h-[400px] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-lg text-center">
              Please select a contact
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Search contacts"
              className="rounded-lg px-4 py-2 bg-[#2c2e3b] border-none text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => searchcontacts(e.target.value)}
            />
          </div>
          {searchedcontacts.length > 0 ? (
            <ScrollArea className="h-[250px] mt-4">
              <div className="flex flex-col gap-5">
                {searchedcontacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer p-2 rounded-lg hover:bg-[#2c2e3b] transition-all"
                    onClick={() => selectnewcontact(contact)}
                  >
                    <Avatar className="w-12 h-12 overflow-hidden rounded-full">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase w-12 h-12 text-lg border flex items-center justify-center rounded-full ${getcolor(
                            contact.color
                          )}`}
                        >
                          {contact.firstname
                            ? contact.firstname.charAt(0)
                            : contact.email.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-white">
                        {contact.firstname && contact.lastname
                          ? `${contact.firstname} ${contact.lastname}`
                          : ""}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationdefaultoptions}
              />
              <div className="ml-4 text-center text-white text-opacity-80">
                <h3 className="text-lg lg:text-2xl font-medium">
                  Hi<span className="text-purple-500">!</span> Search for a new
                  <span className="text-purple-500"> contact</span>.
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
