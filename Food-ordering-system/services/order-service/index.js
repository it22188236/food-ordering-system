require('./utils/setupAlias')
const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./database");
const orderRouter = require("./routes/orderRoute");
const cartRouter = require("./routes/cartRoute");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


dotenv.config();
dbConnection();

const port = process.env.PORT || 5022;

app.use("/api/order/", orderRouter);
app.use("/api/cart/", cartRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
