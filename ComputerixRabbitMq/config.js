// export const rabbitMqConfig = {
//   host: "localhost",
//   port: 5672,
//   username: "guest",
//   password: "guest",
//   vhost: "/",
//   queue: "my_queue",
//   exchange: "my_exchange",
//   routingKey: "my_routing_key",
// };

export const rabbitMqConfig = {
  url: "amqp://localhost",
  exchange: "logExchange",
};