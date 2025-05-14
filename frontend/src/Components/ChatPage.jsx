import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStreamTokken } from '../lib/api'
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'
import ChatLoader from '../sec_Components/ChatLoader'
import CallButton from '../sec_Components/CallButton'
import useAuthUser from '../hooks/useAuthUser.js';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY // Fixed env variable access

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokkenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamTokken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokkenData?.token || !authUser) return;

    const initChat = async () => {
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY, {
          timeout: 10000,
        });

        // Create a minimal user object without the image first
        const userData = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        await client.connectUser(userData, tokkenData.token);

        console.log("Successfully connected user, creating channel...");

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const channel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await channel.watch();
        setChatClient(client);
        setChannel(channel);

        // Update the user with profile picture separately if needed
        if (authUser.profilePic) {
          try {
            await client.partialUpdateUser({
              id: authUser._id,
              set: {
                // Only include image if it's a URL (not base64)
                image: authUser.profilePic.startsWith('http') ? authUser.profilePic : undefined
              }
            });
          } catch (updateError) {
            console.warn("Couldn't update user image:", updateError);
          }
        }

      } catch (error) {
        console.error("Detailed connection error:", {
          error: error.message,
          stack: error.stack,
          tokenValid: !!tokkenData?.token,
          apiKey: STREAM_API_KEY,
          userId: authUser?._id
        });
        toast.error("Chat connection failed. Please refresh or try again later.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser().catch(console.error);
      }
    };
  }, [tokkenData, authUser, targetUserId]);
  if (loading || !chatClient || !channel) return <ChatLoader />;

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({
        text: `I'ev started a video call. Join me here: ${callUrl}`
      });
      toast.success("Video Call Link send Successfully")
    }
  }

  return (
    <div className='h-[91.3vh]'>
      <Chat client={chatClient}>  {/* Added client prop */}
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage;