import amqplib from "amqplib";

const consumer = async () => {
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
        const exchangeName = 'priority_exchange';
        const exchangeType = 'direct';
        const queueName = 'priority_queue';
        const routingKey = 'priority_routing_key';

        // 4. Create exchange (Set durable to true)
        await channel.assertExchange(exchangeName, exchangeType, {
            durable: true
        });
        console.log("✅ Exchange created:", exchangeName);

        // 5. Create queue (Set exclusive to true)
        const queue=await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                'x-max-priority': 10 // Set the maximum priority level for the queue
            }
        });
        console.log("✅ Queue created:", queue,"and",queue.queue);//this is temprary queue which will be deleted when consumer disconnects.{exclusive: true} means only this consumer can use this queue.and then deleted when consumer disconnects.

        // 6. Bind queue
        await channel.bindQueue(queue.queue, exchangeName, routingKey);
        console.log("✅ Queue bound to exchange:", queue.queue);
        
        channel.consume(queue.queue,(msg)=>{
            if(msg){
                const data=JSON.parse(msg.content.toString());
                console.log("✅ message according to priority:", data);
                console.log("✅ priority --:", msg.properties.priority);
                channel.ack(msg);
            }   
        }
    );
}catch (error) {
        console.error("❌ RabbitMQ error:", error);
    }
};

consumer();