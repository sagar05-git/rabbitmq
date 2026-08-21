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
        const userQueueName = "user_email_queue";
        const subscribeUserQueueName = "subscribe_user_email_queue";
        const userRoutingKey = "user_email_routing_key";
        const subscribeUserRoutingKey = "subscribe_user_routing_key";


        // 4. Create exchange (Set durable to true)
        await channel.assertExchange(exchangeName, "direct", {
            durable: true
        });
        console.log("✅ Exchange created:", exchangeName);

        // 5. Create user queue (Set durable to true)
        await channel.assertQueue(userQueueName, {
            durable: true
        });
        console.log("✅ Queue created:", userQueueName);
        // 6. Bind queue
        await channel.bindQueue(userQueueName, exchangeName, userRoutingKey);
        console.log("✅ userQueueName Queue bound");

        // 5. Create subscribe user queue (Set durable to true)
        await channel.assertQueue(subscribeUserQueueName, {
            durable: true
        });
        console.log("✅ Queue created:", subscribeUserQueueName);
        // 6. Bind queue
        await channel.bindQueue(subscribeUserQueueName, exchangeName, subscribeUserRoutingKey);
        console.log("✅ subscribeUserQueueName Queue bound");

        // 7. Message
        const userMessage = {
            to: "new@geeky.dev",
            from: "sagartyagi628@gmail.com",
            subject: "Hello from RabbitMQ",
            body: "please verify your email address to complete the registration process."
        };
        const subscribeUserMessage = {
            to: "new@geeky.dev",
            from: "new@gmail.com",
            subject: "Hello from RabbitMQ",
            body: "thanks for subscribing to our newsletter."
        };

        // 8. Publish user message
        const userPublished = channel.publish(
            exchangeName,
            userRoutingKey,
            Buffer.from(JSON.stringify(userMessage)),
            {
                persistent: true,
                contentType: "application/json"
            }
        );
        // 8. Publish subscribe user message
        const subscribeUserPublished = channel.publish(
            exchangeName,
            subscribeUserRoutingKey,
            Buffer.from(JSON.stringify(subscribeUserMessage)),
            {
                persistent: true,
                contentType: "application/json"
            }
        );

        console.log("✅ userMessage published:", userPublished);
        console.log("userMessage:", userMessage);
        console.log("✅ subscribeUserMessage published:", subscribeUserPublished);
        console.log("subscribeUserMessage:", subscribeUserMessage);

        // 9. Close
        await channel.close();
        await connection.close();
        console.log("✅ RabbitMQ connection closed");

    } catch (error) {
        console.error("❌ RabbitMQ error:", error);
    }
};

sendEmail();