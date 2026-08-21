import amqplib from "amqplib";

const productLaucnh = async (product) => {
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
        const exchangeName = "new_product_exchange";
        const exchangeType = "fanout";

        // 4. Create exchange (Set durable to true)
        await channel.assertExchange(exchangeName, exchangeType, {
            durable: true
        });
        console.log("✅ Exchange created:", exchangeName);

        // 5. Publish product message
        const messagePublished = channel.publish(
            exchangeName,
            "",//no rounting key is required in fanout exchange
            Buffer.from(JSON.stringify(product)),
            {
                persistent: true,
                contentType: "application/json"
            }
        );
        
        console.log("product:", product);
        console.log("✅ Message published:", messagePublished);

        // 6. Close
        await channel.close();
        await connection.close();
        console.log("✅ RabbitMQ connection closed");

    } catch (error) {
        console.error("❌ RabbitMQ error:", error);
    }
}
productLaucnh({ productId: 123, name: "New Product", price: 99.99 });