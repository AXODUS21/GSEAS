import GC from "@models/gc";
import { connectToDB } from "@utils/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    // Query for GCs where the 'members' array includes the given 'id'
    const gcList = await GC.find({ members: params.id });
    
    if (gcList.length === 0) {
      return new Response("No group chats found for this user", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(gcList), { status: 200 });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
