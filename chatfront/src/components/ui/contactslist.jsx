import React from "react";
import { getcolor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ContactsList = ({ contacts, ischannel }) => {
  const {
    selectedchatdata,
    setselectedchatdata,
    setselectedchattype,
    selectedchattype,
    setselectedchatmessages,
  } = useAppStore();

  const handleclick = (contact) => {
    if (ischannel) {
      setselectedchattype("channel");
    } else {
      setselectedchattype("contact");
    }
    setselectedchatdata(contact);
    if (selectedchatdata && selectedchatdata._id !== contact._id) {
      setselectedchatmessages([]);
    }
  };

  return (
    <>
      <div className="mt-5">
        {contacts.map((contact) => {
          return (
            <div
              key={contact._id}
              className={`pl-10 py-3 transition-all duration-300 cursor-pointer flex items-center gap-5 ${
                selectedchatdata && selectedchatdata._id === contact._id
                  ? "bg-[#8417ff] hover:bg-[#8417ff]"
                  : "hover:bg-[#f1f1f111]"
              }`}
              onClick={() => handleclick(contact)}
            >
              {/* Avatar */}
              {!ischannel && (
                <Avatar className="w-10 h-10 overflow-hidden rounded-full">
                  {contact && contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`uppercase w-10 h-10 text-lg border flex items-center justify-center rounded-full ${getcolor(
                        contact.color
                      )}`}
                    >
                      {contact.firstname
                        ? contact.firstname.charAt(0) + contact.lastname.charAt(0)
                        : contact.email
                        ? contact.email.charAt(0)
                        : "U"}
                    </div>
                  )}
                </Avatar>
              )}

             
              <div className="text-white flex-1">
                {ischannel ? (
                  <div className="h-10 flex items-center">
                    <span>{contact.name}</span>
                  </div>
                ) : (
                  <div className="h-10 flex items-center">
                    <span>{`${contact.firstname} ${contact.lastname}`}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ContactsList;
