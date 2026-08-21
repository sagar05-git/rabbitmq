import amqplib from "amqplib";

const receivedMessages = async () => {
    let connection;
    let channel;
    const exchangeName = "notification_exchange";
    const exchangeType = "topic";

    try {
        // 1. Connect to RabbitMQ
        connection = await amqplib.connect(
            "amqp://localhost:5672"
        );

        console.log("✅ Connected to RabbitMQ");

        // 2. Create channel
        channel = await connection.createChannel();

        console.log("✅ Channel created");

        // 3. Define RabbitMQ resources
        const orderQueueName = "order_queue";

        await channel.assertExchange(exchangeName, exchangeType, {
            durable: true
        });
        console.log("✅ Exchange created:", exchangeName);

        // 4. Make sure queue exists
        await channel.assertQueue(
            orderQueueName,
            {
                durable: true
            }
        );

        console.log("✅ orderQueueName Queue ready");
        // 5. Bind queue to exchange with routing key
        await channel.bindQueue(orderQueueName, exchangeName, "order.*");
        console.log("✅ orderQueueName Queue bound");

        // 5. Start consuming
        console.log("Waiting for messages...");

        channel.consume(
            orderQueueName,
            (message) => {

                // Consumer can receive null
                if (message === null) {
                    console.log(
                        "Consumer cancelled"
                    );
                    return;
                }

                // 6. Convert Buffer → string → object
                const data = JSON.parse(
                    message.content.toString()
                );

                console.log(
                    "Received:",
                    data
                );

                // 7. Tell RabbitMQ message was successfully processed --acknowledge to rabbit mq
                channel.ack(message);
            }
        );


    } catch (error) {
        console.error(
            "❌ RabbitMQ error:",
            error
        );
    }
};

receivedMessages();