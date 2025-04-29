const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./database");
const http = require("http");
const { init } = require("./websockets/websocketServer");
const { start } = require("./rabbitmq/consumer");

const app = express();
const server = http.createServer(app);
app.use(express.json());

dotenv.config();
dbConnection();

const wss = init(server);
start(wss);

const port = process.env.PORT || 5052;

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
