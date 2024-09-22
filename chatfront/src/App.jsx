import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import apiclient from "@/lib/api-client";
import { GET_USER_INFO } from "@/utils/constants";
import { toast } from "sonner";

const PrivateRoute = ({ children }) => {
  const { userinfo } = useAppStore();
  const isauthorised = !!userinfo && Object.keys(userinfo).length > 0;

  if (!isauthorised) {
    return <Navigate to='/auth' />;
  }

  // if (!userinfo.profilesetup) {
  //   return <Navigate to='/profile' />;
  // }

  return children;
};

const AuthRoute = ({ children }) => {
  const { userinfo } = useAppStore();
  const isauthorised = !!userinfo && Object.keys(userinfo).length > 0;

  if (isauthorised) {
    return <Navigate to='/chat' />;
  }

  return children;
};

function App() {
  const { userinfo, setuserinfo } = useAppStore();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getuserinfo = async () => {
      try {
        const response = await apiclient.get(GET_USER_INFO, {
          withCredentials: true
        });
        setuserinfo({ ...response.data });
        console.log('User info fetched:', response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized access - redirecting to login:', error);
        } else {
          console.error('Failed to fetch user info:', error);
        }
      } finally {
        setloading(false);
      }
    };

    if (Object.keys(userinfo).length === 0) {
      getuserinfo();
    } else {
      setloading(false);
    }
  }, [userinfo, setuserinfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        } />
        <Route path='/chat' element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } />
        <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;