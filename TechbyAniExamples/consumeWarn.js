import amqplib from "amqplib";

const consumeWarn=async()=>{
    try{
        let connection;
        let channel;

        // 1. Connect
        connection=await amqplib.connect("amqp://localhost:5672");
        console.log("✅ Connected to RabbitMQ");

        // 2. Create channel
        channel=await connection.createChannel();
        console.log("✅ Channel created");

        // 3. Names
        const exchangeName="log_exchange";
        const exchangeType="direct";
        const queueName="queue";

        // 4. Create exchange (Set durable to true)
        await channel.assertExchange(exchangeName,exchangeType,{
            durable:true
        });
        console.log("✅ Exchange created:",exchangeName);
        // 5. Create queue (Set exclusive to true)
        const queue=await channel.assertQueue(queueName,{durable:true});
        console.log("✅ Queue created:",queue,"and",queue.queue);//this is temprary queue which will be deleted when consumer disconnects.{exclusive: true} means only this consumer can use this queue.and then deleted when consumer disconnects.

        // 6. Bind queue
        await channel.bindQueue(queue.queue,exchangeName,"warn");
        console.log("✅ Queue bound to exchange:",queue.queue);
        
        channel.consume(queue.queue,(msg)=>{
            if(msg){
                const data=JSON.parse(msg.content.toString());
                console.log("✅ Info Log received:",data);
                channel.ack(msg);
            }   
        }
    );

    }catch(error){
        console.error("❌ RabbitMQ error:", error);
    }
}
consumeWarn();