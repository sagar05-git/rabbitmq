import amqplib from "amqplib";

const produceMessage=async(headers,message)=>{
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
        const exchangeName="header_exchange_example";
        const exchangeType="headers";

        // 4. Create exchange (Set durable to true)
        await channel.assertExchange(exchangeName,exchangeType,{
            durable:true
        });
        console.log("✅ Exchange created:",exchangeName);
        
        channel.publish(exchangeName,"",Buffer.from(JSON.stringify(message)),{
            persistent:true,
            contentType:"application/json",
            headers:headers
            }
        );
        console.log("✅ Message published");

        // 5. Close
        await channel.close();
        await connection.close();
        console.log("✅ RabbitMQ connection closed");

    }catch(error){
        console.error("❌ RabbitMQ error:", error);
    }
}
produceMessage({"x-match":"all",notificationType:"live_stream",contentType:"live_stream"
},{Live:123,liveName:"RabbitMQ Tutorial live stream"});
produceMessage({"x-match":"all",notificationType:"video",contentType:"video"
},{videoId:123,videoName:"RabbitMQ Tutorial video"});
// like notification type  for x-match any
produceMessage({"x-match":"any",notificationTypeLike:"like"
},{likeId:123,likeName:"RabbitMQ Tutorial like "});
// comment notification type  for x-match any
produceMessage({"x-match":"any",notificationTypeComment:"comment"
},{commentId:123,commentName:"RabbitMQ Tutorial  comment"});
