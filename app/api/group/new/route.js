import GC from "@models/gc";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {
  const { members, name, image } = await req.json();

  try {
    await connectToDB();
    const newGC = new GC({ members, name, image });

    await newGC.save();
    return new Response(JSON.stringify(newGC), { status: 201 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Failed to create prompt" }), {
      status: 500,
    });
  }
};