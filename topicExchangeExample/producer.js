import amqplib from "amqplib";

const sendMessage = async (routingKey, message) => {
    let connection;
    let channel;

    try {
        // 1. Connect
        connection = await amqplib.connect("amqp://localhost:5672");
        console.log("✅ Connected to RabbitMQ");

        // 2. Create channel
        channel = await connection.createChannel();
        console.log("✅ Channel created");

        // 3. Names
        const exchangeName = "notification_exchange";
        const exchangeType = "topic";

        // 4. Create exchange (Set durable to true)
        await channel.assertExchange(exchangeName, exchangeType, {
            durable: true
        });
        console.log("✅ Exchange created:", exchangeName);
        // work of bind and queue is done in consumer.js file because consumer is the one who will consume the message from queue. So, it should bind the queue to exchange with routing key.
        


        // 8. Publish user message
        const messagePublished = channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            {
                persistent: true,
                contentType: "application/json"
            }
        );

        console.log("userMessage:", message);
        console.log("✅ Message published:", messagePublished);
        console.log(`Routing Key: ${routingKey} ,message publish on this routing key`);

        // 9. Close
        await channel.close();
        await connection.close();
        console.log("✅ RabbitMQ connection closed");

    } catch (error) {
        console.error("❌ RabbitMQ error:", error);
    }
};

sendMessage('order.created', { orderId: 123, status: 'created' });
sendMessage('payment.completed', { paymentId: 456, status: 'completed' });
sendMessage('order', { orderId: 123, status: 'order' });//these are not working after changing the routing key.we need exect one word after dot.
sendMessage('payment', { paymentId: 456, status: 'payment' });