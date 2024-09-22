import { useAppStore } from "@/store";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from 'react-icons/io5';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getcolor } from "@/lib/utils";
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiclient from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTES, REMOVE_PROFILE_IMAGE_ROUTES, UPDATE_PROFILE_ROUTES } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userinfo, setuserinfo } = useAppStore();
  const [firstname, setfirstname] = useState(userinfo.firstname || "");
  const [lastname, setlastname] = useState(userinfo.lastname || "");
  const [image, setimage] = useState(null);
  const [hovered, sethovered] = useState(false);
  const [selectedcol, setselectedcol] = useState(userinfo.color || 0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userinfo.profilesetup) {
      setfirstname(userinfo.firstname);
      setlastname(userinfo.lastname);
      setselectedcol(userinfo.color);
    }
    if (userinfo.image) {
      setimage(userinfo.image);
    }
  }, [userinfo, setuserinfo]);

  const validateprofile = () => {
    if (!firstname.length) {
      toast.error("Please enter firstname");
      return false;
    }
    if (!lastname.length) {
      toast.error("Please enter lastname");
      return false;
    }
    return true;
  };

  const savechanges = async () => {
    if (validateprofile()) {
      try {
        const response = await apiclient.post(UPDATE_PROFILE_ROUTES, { firstname, lastname, color: selectedcol }, { withCredentials: true });
        if (response.status === 200) {
          setuserinfo(response.data);
          toast.success('Profile updated');
          navigate('/chat');
        } else {
          toast.error('Failed to update profile. Please try again.');
        }
      } catch (error) {
        toast.error('An error occurred while updating the profile. Please try again.');
      }
    }
  };

  const handlefile = () => {
    fileInputRef.current.click();
  };

  const handleimgchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formdata = new FormData();
      formdata.append('profileimage', file);
      try {
        const response = await apiclient.post(ADD_PROFILE_IMAGE_ROUTES, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        if (response.status === 200 && response.data) {
          setuserinfo({ ...userinfo, image: response.data });
          toast.success('Image uploaded');
        }
      } catch (error) {
        toast.error('Failed to upload image. Please try again.');
      }
      const reader = new FileReader();
      reader.onload = () => {
        setimage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handledeleteimg = async () => {
    try {
      const response = await apiclient.delete(REMOVE_PROFILE_IMAGE_ROUTES, {
        withCredentials: true
      });
      if (response.status === 200) {
        setuserinfo({ ...userinfo, image: null });
        toast.success("Image removed successfully!");
        setimage(null);
      }
    } catch (error) {
      toast.error('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="bg-[#1b1c24] h-screen flex items-center justify-center flex-col gap-10 px-6">
      <h1 className="text-4xl font-semibold text-white">Profile Page</h1>
      <div className="flex flex-col gap-10 w-full md:w-[500px]">
        <div className="flex justify-start">
          <IoArrowBack className='text-3xl lg:text-4xl text-white cursor-pointer' onClick={() => navigate('/chat')} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative h-32 w-32 md:h-48 md:w-48 flex items-center justify-center"
            onMouseEnter={() => sethovered(true)}
            onMouseLeave={() => sethovered(false)}>
            <Avatar className='w-full h-full rounded-full overflow-hidden'>
              {image ? (
                <AvatarImage src={image} alt='profile' className='object-cover w-full h-full bg-black' />
              ) : (
                <div className={`uppercase w-full h-full text-5xl border flex items-center justify-center rounded-full ${getcolor(selectedcol)}`}>
                  {firstname ? firstname.charAt(0) : (userinfo.email ? userinfo.email.charAt(0) : "U")}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                {image ? <FaTrash className="text-white text-3xl cursor-pointer" onClick={handledeleteimg} /> : <FaPlus className="text-white text-3xl cursor-pointer" onClick={handlefile} />}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleimgchange} accept=".png, .jpg, .jpeg, .svg" />
          </div>

          <div className="flex flex-col w-full gap-4">
            <Input placeholder='Email' type='email' disabled value={userinfo.email} className='bg-[#2c2e3b] text-white p-4 rounded-lg' />
            <Input placeholder='First Name' value={firstname} onChange={(e) => setfirstname(e.target.value)} className='bg-[#2c2e3b] text-white p-4 rounded-lg' />
            <Input placeholder='Last Name' value={lastname} onChange={(e) => setlastname(e.target.value)} className='bg-[#2c2e3b] text-white p-4 rounded-lg' />

            <div className="flex gap-4">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} h-10 w-10 rounded-full cursor-pointer ${selectedcol === index ? 'ring-4 ring-white/50' : ''}`}
                  onClick={() => setselectedcol(index)}>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button className='h-14 w-full bg-purple-700 text-white hover:bg-purple-900 transition-all' onClick={savechanges}>
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default Profile;
