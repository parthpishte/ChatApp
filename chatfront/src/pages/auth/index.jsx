import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Tabs } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiclient from "@/lib/api-client.js";
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import chatlogo from '@/assets/chatlogo.jpg';
const Auth = () => {
  const navigate = useNavigate();
  const { setuserinfo,userinfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const validatesignup = () => {
    if (!email.length) {
      toast.error("Please enter email");
      return false;
    }
    if (!password.length) {
      toast.error("Please enter password");
      return false;
    }
    if (password !== confirmpassword) {
      toast.error("Password and confirm password should be the same");
      return false;
    }
    return true;
  };

  const validatelogin = () => {
    if (!email.length) {
      toast.error("Please enter email");
      return false;
    }
    if (!password.length) {
      toast.error("Please enter password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validatelogin()) {
      try {
        const response = await apiclient.post(
          LOGIN_ROUTES,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 200) {
          const loggedInUser = response.data.user;
          setuserinfo({ ...loggedInUser });
          console.log("Logged in user:", userinfo);

          if (loggedInUser.profilesetup) {
            return navigate("/chat");
          } else {
            return navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("An error occurred during login. Please try again.");
      }
    }
  };

  const handleSignup = async () => {
    if (validatesignup()) {
      try {
        const response = await apiclient.post(
          SIGNUP_ROUTES,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 200) {
          const newUser = response.data.user;
          setuserinfo({ ...newUser });

          if (newUser.profilesetup) {
            return navigate("/chat");
          } else {
            return navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Signup failed:", error);
        toast.error("An error occurred during signup. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="h-[80vh] bg-white border border-gray-200 shadow-lg w-[90vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center p-8 md:p-10">
          <div className="flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold md:text-5xl text-gray-800">
              Welcome
            </h1>
            <p className="font-medium text-center mt-4 text-gray-500">
              Fill in your details to get started
            </p>
          </div>
          <div className="w-full">
            <Tabs className="w-full" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full flex">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:border-b-purple-500 data-[state=active]:text-purple-600 text-black w-1/2 border-b-2 p-3 transition duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:border-b-purple-500 data-[state=active]:text-purple-600 text-black w-1/2 border-b-2 p-3 transition duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-6" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-4 border-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-4 border-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-4 bg-purple-600 hover:bg-purple-700 text-white transition duration-300"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-6" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-4 border-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-4 border-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-4 border-gray-300"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-4 bg-purple-600 hover:bg-purple-700 text-white transition duration-300"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className=" hidden xl:flex justify-center items-center bg-purple-100 rounded-r-3xl">
          <img
            src={chatlogo}
            alt="Auth Illustration"
            className="h-full w-full object-cover rounded-r-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
