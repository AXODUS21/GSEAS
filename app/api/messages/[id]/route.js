import { connectToDB } from "@utils/database";
import GC from "@models/gc";

export const GET = async (req, {params}) => {
    try {
        await connectToDB();
        const groupChat = await GC.findById(params.id);
        return new Response(JSON.stringify(groupChat.messages), {status: 200});
    } catch (error) {
        console.error('Error connecting to the database:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to connect to the database' }) };
    }
}