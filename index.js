const express = require("express");
const amqplib = require("amqplib");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  res.send("Publish a rabbitMQ message");
});

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

(async () => {
  const RABBITMQ_URL =
    "amqps://student:XYR4yqc.cxh4zug6vje@rabbitmq-exam.rmq3.cloudamqp.com/mxifnklj";

  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  const QUEUE = "exam";
  const MESSAGE_PALYLOAD = "Hi CloudAMQP, this was fun!";
  const ROUTING_KEY = "0c5be191-7191-47ba-b461-0a441eefb245";
  const EXCHANGE = "exchange.0c5be191-7191-47ba-b461-0a441eefb245";

  await channel.assertExchange(EXCHANGE, "topic", { durable: false });
  await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

  console.log("Connection established and queue bound to the exchange.");

  // Publish a message to the exchange
  await channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(MESSAGE_PALYLOAD), {
    persistent: true,
  });

  console.log("Message published successfully.");

  // Delete the exchange and bindings
  await channel.deleteExchange(EXCHANGE);
  await channel.unbindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

  // close connection
  await channel.close();
  await connection.close();
})();
