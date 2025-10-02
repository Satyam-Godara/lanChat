const express = require("express");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const PORT = 8080;

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Open http://localhost:${PORT} on this PC`);
  console.log(`📱 Or http://<your-PC-IP>:${PORT} on phone (same Wi-Fi)`);
});

// Attach WebSocket server
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("✅ New client connected");

  ws.on("message", (message) => {
    console.log("💬 Received:", message.toString());

    // Broadcast to ALL (including sender)
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients = clients.filter((client) => client !== ws);
  });
});
