import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser.js';
import { getStreamTokken } from '../lib/api';

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  CallingState,
  useCallStateHooks,
  StreamTheme,

} from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast';
import PageLoader from "../sec_Components/PageLoader"
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: CallId } = useParams();
  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(null);
  const { authUser, isLoading } = useAuthUser();

  const { data: tokkenData } = useQuery({
    queryKey: ["streamTokken"],
    queryFn: getStreamTokken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      setIsConnecting(true);
      if (!tokkenData.token || !authUser || !CallId) return;
      try {
        console.log("Initilizing Chat Stream video Client...")
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokkenData.token,
        });
        const callInstance = videoClient.call("default", CallId)
        await callInstance.join({ create: true })
        console.log("Joint call Successfully");
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.log("Error in joinging Call:", error)
        toast.error("Couln't join the call , please try again.")
      }
      finally {
        setIsConnecting(false);
      }
    }
    initCall();
  }, [tokkenData, authUser, CallId])
  if (isLoading || isConnecting) return <PageLoader />
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='relative '>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) :
          (
            <div className='flex items-center justify-center h-full'>
              <p>Couldn't Initilizing Call , please try again</p>
            </div>
          )
        }
      </div>
    </div>
  )
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;