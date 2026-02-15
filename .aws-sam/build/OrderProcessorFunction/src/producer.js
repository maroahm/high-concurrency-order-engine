const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient({});

exports.handler = async (event) => {
    const orderData = JSON.parse(event.body);
    
    const params = {
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: JSON.stringify({
            orderId: Date.now().toString(),
            ...orderData
        }),
    };

    await sqs.send(new SendMessageCommand(params));

    return {
        statusCode: 202, // "Accepted" - order is being processed
        body: JSON.stringify({ message: "Order queued successfully!" }),
    };
};