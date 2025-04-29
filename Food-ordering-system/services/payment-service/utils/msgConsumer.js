const connectRabbitMQ = require('./connectRabbitMQ');

const receivePayments = async (userId) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  const exchangeName = 'paymentExchange';

  await channel.assertExchange(exchangeName, 'direct', { durable: true });
  const { queue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue, exchangeName, userId);

  console.log(`💳 Payment service listening for user ${userId} payments...`);

  channel.consume(queue, (msg) => {
    const paymentInfo = JSON.parse(msg.content.toString());
    console.log('✅ Payment received for processing:', paymentInfo);
    channel.ack(msg);
  });
};

module.exports = receivePayments;
