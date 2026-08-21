import amqp from 'amqplib';
import { rabbitMqConfig } from './config.js';
import ErrorHandler from './utils/error.js';
import TryCatch  from './utils/customTryCatch.js';

class Producer{

    // create channel
    // async createChannel() {
    //     try {
    //         const connection = await amqp.connect(rabbitMqConfig.url);
    //         if (!connection) {
    //             throw new ErrorHandler('Failed to connect to RabbitMQ', 500);
    //         }
    //         const channel = await connection.createChannel();
    //         return channel;
    //     } catch (error) {
    //         console.error('Error creating channel:', error);
    //         next(error);
    //     }
    // }
    static connection = null;
    static channel = null;

    static createChannel= TryCatch(async (req,res,next) => {
        if (Producer.channel) {
            return Producer.channel;
        }
        Producer.connection= await amqp.connect(rabbitMqConfig.url);
        if (!Producer.connection) {
            return next(new ErrorHandler('Failed to connect to RabbitMQ', 500));
        }
        Producer.channel = await Producer.connection.createChannel();
        return Producer.channel;
    });

    static publishMessage= TryCatch(async (channel, exchange,exchangeType, routingKey, message) => {
        if(!Producer.channel) {
            await Producer.createChannel();
        }
        await Producer.channel.assertExchange(exchange, exchangeType, { durable: true });
        const published = Producer.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)),
        {
            persistent: true
        });
        if (!published) {
            console.warn(
                 "RabbitMQ write buffer is full"
            );
        }
        console.log(`Message sent to exchange "${exchange}" with routing key "${routingKey}": ${message}`);
    });

    static closeConnection = TryCatch(async (x) => {
        try {
            if (Producer.channel) {
                await Producer.channel.close();
            }

            if (Producer.connection) {
                await Producer.connection.close();
            }

            Producer.channel = null;
            Producer.connection = null;

            console.log("RabbitMQ connection closed");

        } catch (error) {
            console.error(
                "Error closing RabbitMQ connection:",
                error
            );
        }
    }

}
export default Producer;