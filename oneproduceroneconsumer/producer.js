import amqplib from "amqplib";

const sendEmail = async () => {
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
        const exchangeName = "email_exchange";
        const queueName = "email_queue";
        const routingKey = "email_routing_key";

        // 4. Create exchange (Set durable to true)
        await channel.assertExchange(exchangeName, "direct", {
            durable: true
        });
        console.log("✅ Exchange created:", exchangeName);

        // 5. Create queue (Set durable to true)
        await channel.assertQueue(queueName, {
            durable: true
        });
        console.log("✅ Queue created:", queueName);

        // 6. Bind queue
        await channel.bindQueue(queueName, exchangeName, routingKey);
        console.log("✅ Queue bound");

        // 7. Message
        const message = {
            to: "new@geeky.dev",
            from: "sagartyagi628@gmail.com",
            subject: "Hello from RabbitMQ",
            body: "This is a test email sent via RabbitMQ."
        };

        // 8. Publish
        const published = channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            {
                persistent: true,
                contentType: "application/json"
            }
        );

        console.log("✅ Message published:", published);
        console.log("Message:", message);

        // 9. Close
        await channel.close();
        await connection.close();
        console.log("✅ RabbitMQ connection closed");

    } catch (error) {
        console.error("❌ RabbitMQ error:", error);
    }
};

sendEmail();