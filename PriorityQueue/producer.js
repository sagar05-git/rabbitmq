import amqplib from 'amqplib';

const priorityQueueProducer = async () => {
    let connection;
    let channel;
    try {
        connection = await amqplib.connect('amqp://localhost:5672');
        console.log('✅ Connected to RabbitMQ');

        channel = await connection.createChannel();
        console.log('✅ Channel created');

        const exchangeName = 'priority_exchange';
        const exchangeType = 'direct';
        const queueName = 'priority_queue';
        const routingKey = 'priority_routing_key';

        await channel.assertExchange(exchangeName, exchangeType, {
            durable: true
        });
        console.log('✅ Exchange created:', exchangeName);

        await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                'x-max-priority': 10 // Set the maximum priority level for the queue
            }
        });
        console.log('✅ Queue created:', queueName);

        await channel.bindQueue(queueName, exchangeName,routingKey);

        const data = [
            { priority: 10, message: "This is a high priority  10 -message" },
            { priority: 1, message: "This is a low priority 1 -message" },
            { priority: 5, message: "This is a medium priority 5 -message" },
            { priority: 1, message: "This is a low priority 1 -message" }
        ]
        data.forEach((item) => {
            channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(item.message)), {
                priority: item.priority,
                persistent: true
            });
            console.log(`✅ Message sent: ${item.message} with priority ${item.priority}`);
        });

        await channel.close();
        await connection.close();
        console.log('✅ RabbitMQ connection closed');

    } catch (error) {
        
    }
}
priorityQueueProducer()