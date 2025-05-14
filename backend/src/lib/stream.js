import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    console.log("Updating Stream user with:", userData);
    await streamClient.upsertUser({
      id: userData.id,
      name: userData.name,
      image: userData.image?.startsWith('http')
        ? userData.image
        : `${process.env.BASE_URL || 'http://localhost:5001'}${userData.image}`
    });
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    throw error;
  }
};
export const generateStreamToken = (userId) => {
  try {
    const serverClient = StreamChat.getInstance(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );

    if (!serverClient) throw new Error("Failed to create Stream instance");
    if (!userId) throw new Error("User ID required");

    return serverClient.createToken(userId);
  } catch (error) {
    console.error("Token generation failed:", error);
    throw error;
  }
};