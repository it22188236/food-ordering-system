const express = require("express");
const dbConnection = require("./database");
const dotenv = require("dotenv");
const { consumeFromQueue } = require("./utils/rabbitmq");
const axios = require('axios');

const app = express();
app.use(express.json());

dotenv.config();
dbConnection();

const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const PAYHERE_RETURN_URL = process.env.PAYHERE_RETURN_URL;
const PAYHERE_CANCEL_URL = process.env.PAYHERE_CANCEL_URL;
const PAYHERE_NOTIFY_URL = process.env.PAYHERE_NOTIFY_URL;

consumeFromQueue("payment_requests", async (paymentData) => {
  const {
    orderID,
    userID,
    amount,
    email,
    phone,
    items,
  } = paymentData;

  const payHereRequest = {
    merchant_id: PAYHERE_MERCHANT_ID,
    return_url: PAYHERE_RETURN_URL,
    cancel_url: PAYHERE_CANCEL_URL,
    notify_url: PAYHERE_NOTIFY_URL,
    order_id: orderID,
    // items: items.map((item) => item.name).join(", "),
    amount: amount,
    currency: "LKR",
    email,
    phone
  };

  try {
    const form = new URLSearchParams(payHereRequest).toString();
    const payHereUrl = `https://sandbox.payhere.lk/pay/checkout?${form}`;
    
    console.log("🔗 PayHere URL:", payHereUrl);
    // You can notify the frontend via socket or database record
  } catch (error) {
    console.error("💥 PayHere Error:", error.message);
  }
});

const port = process.env.PORT || 5042;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
  // receivemsg();
});
