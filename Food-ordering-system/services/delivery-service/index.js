require("./utils/setupAlias.js");
const express = require("express");
const dbConnection = require("./database");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { consumeFromQueue } = require("./utils/rabbitmq");
const deliveryController = require("./controllers/deliveryController");
const EventType = require("@shared/events/eventTypes");

const deliveryRoute = require("./routes/deliveryRoute");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

dotenv.config();
dbConnection();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-delivery-room", () => {
    socket.join("delivery_room");
    console.log(`Socket ${socket.id} joined delivery room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

consumeFromQueue("delivery_requests", async (message) => {
  switch (message.type) {
    case "DELIVERY_CREATED":
      await deliveryController.createDelivery(message.data);

      io.to("delivery_room").emit("new-delivery", {
        deliveryID: message.data._id,
        restaurantID: message.data.restaurantID,
        customerID: message.data.userID,
        address: message.data.deliveryAddress,
        totalPrice: message.data.totalPrice,
        status: message.data.status,
      });
      console.log("📦 Broadcasted new delivery to delivery_room");
      console.log("👀 Emitting new delivery event with data:", {
        deliveryID: message.data._id,
        restaurantID: message.data.restaurantID,
        customerID: message.data.userID,
        address: message.data.deliveryAddress,
        totalPrice: message.data.totalPrice,
        status: message.data.status,
      });
      break;
  }
});

// Handle driver updates
consumeFromQueue("driver_updates", async (message) => {
  switch (message.type) {
    case EventType.DRIVER_PICKED_UP:
      await deliveryController.updateDeliverStatus(
        message.data.deliveryPersonID,
        "OnTheWay"
      );
      break;
    case EventType.DELIVERY_COMPLETED:
      await deliveryController.updateDeliverStatus(
        message.data.deliveryPersonID,
        "Delivered"
      );
      break;
  }
});

const port = process.env.PORT || 5032;

app.use("/api/delivery", deliveryRoute);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
  // receiveDeliveryOrders();
});
