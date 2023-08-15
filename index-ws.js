const express = require("express");
const server = require("http").createServer();

const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.on("request", app);
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log("Clients connected", numClients);

  wss.broadcast(`Clients connected ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to cyber chat!");
  }

  ws.on("close", function close() {
    wss.broadcast(`Clients connected ${numClients}`);
    console.log("The client has disconnected");
  });
});
