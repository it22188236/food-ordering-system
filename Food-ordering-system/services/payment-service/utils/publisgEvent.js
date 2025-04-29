const connectRabbitMQ = require("./connectRabbitMQ");

const publishEvent = async (event, data) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  const exchange = "paymentEvents";
  await channel.assertExchange(exchange, "fanout", { durable: true });

  channel.publish(exchange, "", Buffer.from(JSON.stringify({ event, data })));

  setTimeout(() => {
    connection.close();
  }, 500);
};

module.exports = publishEvent;
