const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

const cors = require("cors");

// Set up CORS middleware for your Express app
app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Set up the Socket.IO server with CORS options
  const io = new Server(server, {
    cors: {
      origin: "https://gseas.vercel.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("sendMessage", (messageData) => {
      // Broadcast the message to all clients
      io.emit("receiveMessage", messageData);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  // Test CORS endpoint (for debugging purposes)
  server.on("request", (req, res) => {
    if (req.url === "/test-cors") {
      res.setHeader("Access-Control-Allow-Origin", "https://gseas.vercel.app");
      res.writeHead(200);
      res.end("CORS is working!");
    }
  });

  // Start the server
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
