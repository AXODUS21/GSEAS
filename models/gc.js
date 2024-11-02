import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

const GCSchema = new Schema({
  members: {
    type: [String],
    required: [true, "Email is required!"],
  },
  name: {
    type: String,
  },
  messages: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId, 
        default: () => new mongoose.Types.ObjectId(), // Automatically generates a new ObjectId
      },
      type: {
        type: String, // Defines the type of the message, for example, 'text', 'image', etc.
      },
      senderImage:{
        type: String, // Defines the
        required: true,
      },
      sender: {
        type: String, // the name of the sender of the message
        required: true,
      },
      content: {
        type: String, // The actual content of the message.
        required: true,
      },
      timestamp: {
        type: Date, // Records the time when the message was sent.
        default: Date.now, // Automatically sets the current date/time if not provided.
      },
    },
  ],
  image: {
    type: String,
  },
});

const GC = models.GC || model("GC", GCSchema);

export default GC;;
