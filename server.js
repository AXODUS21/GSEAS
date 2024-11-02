const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

    const io = new Server(server, {
      cors: {
        origin: "https://gseas.vercel.app/", // Replace with your Vercel app URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("sendMessage", (messageData) => {
      // Save message to database logic if needed
      io.emit("receiveMessage", messageData); // Broadcasts to all clients
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
