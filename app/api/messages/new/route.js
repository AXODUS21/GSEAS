import { connectToDB } from "@utils/database";
import GC from "@models/gc";

export const POST = async (req) => {
    const {gcId, senderImage, sender, content} = await req.json();

    try {
      await connectToDB();

      const groupChat = await GC.findById(gcId);
      const newMessage = {
        senderImage,
        sender,
        content,
      };

      // Push the new message to the messages array
      groupChat.messages.push(newMessage);

      // Save the updated group chat document
      await groupChat.save();

      return new Response(
        JSON.stringify({ message: "Message added successfully", groupChat }),
        { status: 200 }
      );
    } catch (err) {
        return new Response(
          JSON.stringify({ error: "Failed to create prompt" }),
          {
            status: 500,
          }
        );
    }
}