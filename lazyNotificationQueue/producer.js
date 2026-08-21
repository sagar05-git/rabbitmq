import amqplib from "amqplib";

const lazyNotificationQueueProducer = async (notification) => {
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
        const exchangeName = "lazy_notification_exchange";
        const exchangeType = "direct";
        const routingKey = "lazy_notification_routing_key";
        const queueName = "lazy_notification_queue";

        await channel.assertExchange(exchangeName, exchangeType, {
            durable: true
        });
        console.log("✅ Exchange created:", exchangeName);

        await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                "x-queue-mode": "lazy" // Set the queue to lazy mode
            }
        });
        console.log("✅ Queue created:", queueName);

        await channel.bindQueue(queueName, exchangeName, routingKey);
        console.log("✅ Queue bound to exchange:", queueName);

        // 4. Publish notification message
        const messagePublished = channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(notification)),
            {
                persistent: true,
                contentType: "application/json"
            }
        );
        
        console.log("notification:", notification);
        console.log("✅ Message published:", messagePublished);

    } catch (error) {
        console.error("❌ RabbitMQ error:", error);
    } finally {
        // 5. Close
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log("✅ RabbitMQ connection closed");
    }
};

lazyNotificationQueueProducer({ notificationId: 456, message: "New Notification"});