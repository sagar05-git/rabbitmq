import amqplib from "amqplib";
const producer=async()=>{
    let connection;
    let channel;
    const exchange_Name='log_exchange';
    const exchange_Type='direct';
    const data=[
        {
            key:'info',
            message:'This is info log'
        },
        {
            key:'error',
            message:'This is error log'
        },
        {
            key:'warn',
            message:'This is warning log'
        }
    ]
    try{
        connection = await amqplib.connect("amqp://localhost:5672");
        // create channel
        channel=await connection.createChannel();
        // declare exchange
        await channel.assertExchange(exchange_Name,exchange_Type,{durable:true});
        // publish message
        data.forEach((item)=>{
            channel.publish(exchange_Name,item.key,Buffer.from(JSON.stringify(item)));
            console.log(`✅ Message sent to exchange ${exchange_Name} with routing key ${item.key}:`,item.message);
        })

    }catch(error){
        console.error("❌ RabbitMQ error:", error);
    }finally{
        // close channel and connection
        if(channel){
            await channel.close();
            console.log("✅ Channel closed");
        }
        if(connection){
            await connection.close();
            console.log("✅ Connection closed");
        }
    }
}
producer();