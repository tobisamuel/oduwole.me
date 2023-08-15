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

process.on("SIGINT", () => {
  wss.clients.forEach(function each(client) {
    client.close();
  });

  server.close(() => {
    shutdownDB();
  });
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

  db.run(
    `INSERT into visitors (count, time) VALUES (${numClients}, datetime('now'))`
  );

  ws.on("close", function close() {
    wss.broadcast(`Clients connected ${numClients}`);
    console.log("The client has disconnected");
  });
});

// Databases
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )  
  `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("Shutting down");
  db.close();
}
