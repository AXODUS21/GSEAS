import { connectToDB } from "@utils/database";
import GC from "@models/gc";

export const GET = async (req, {params}) => {
    try {   
        await connectToDB();
        const gc = await GC.findOne({_id: params.id})
        return new Response(JSON.stringify(gc), { status: 200 });
    } catch (e) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();

    const updates = await req.json(); // Extract the updates from the request body

    // Find the group chat by id and update fields based on the request body
    const updatedGC = await GC.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...(updates.name && { name: updates.name }),
          ...(updates.image && { image: updates.image }),
        },
        ...(updates.member && { $addToSet: { members: updates.member } }), // Add member if provided and unique
      },
      { new: true } // Return the updated document
    );

    if (!updatedGC) {
      return new Response("Group Chat not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedGC), { status: 200 });
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (req, {params}) => {
  try {
    await connectToDB();
    const gc = await GC.findByIdAndDelete(params.id);
    
    if (!gc) {
      return new Response("Group Chat not found", { status: 404 });
    }
    
    return new Response("Group Chat deleted successfully", { status: 204 });
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
}