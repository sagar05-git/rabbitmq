import amqplib from "amqplib";

const consumer = async () => {
    let connection;
    let channel;

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
        const userQueueName = "user_email_queue";

        // 4. Make sure queue exists
        await channel.assertQueue(
            userQueueName,
            {
                durable: true
            }
        );

        console.log("✅ userQueueName Queue ready");

        // 5. Start consuming
        console.log("Waiting for messages...");

        channel.consume(
            userQueueName,
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

consumer();