const connectRabbitMQ = require('./connectRabbitMQ');

const createQueue = async (queueName) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  return queueName;
};

const sendToQueue = async (queueName, message) => {
  const connection = await connectRabbitMQ();
  const queue = await createQueue(queueName);
  connection.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
};

const consumeFromQueue = async (queueName, callback) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  const queue = await createQueue(queueName);
  
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel.ack(msg);
    }
  });
};

module.exports = {
  connectRabbitMQ,
  createQueue,
  sendToQueue,
  consumeFromQueue
};