import mongoose from "mongoose";

let isConnected = false; // track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("Already connected to the database.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "create_chat", //*the name of the database that you want to show up on the collection
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;

    console.log("Connected to the Database.");
  } catch (err) {
    console.log(err);
  }
};
