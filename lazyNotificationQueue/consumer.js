import amqplib from "amqplib";

const lazyNotificationQueueConsumer = async () => {
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
        const queueName = "lazy_notification_queue";

        // 4. Create queue (Set durable to true)           
        await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                "x-queue-mode": "lazy" // Set the queue to lazy mode
            }
        });
        console.log("✅ Queue created:", queueName);

        // 5. Consume messages from the queue
        channel.consume(queueName, (msg) => {
            if (msg) {
                const notification = JSON.parse(msg.content.toString());
                console.log("✅ Lazy Notification received:", notification);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("❌ RabbitMQ error:", error);
    }
};

lazyNotificationQueueConsumer();