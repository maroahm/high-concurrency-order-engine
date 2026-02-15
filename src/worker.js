const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// 1. Initialize the DynamoDB Client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    // SQS sends messages in "Records". 
    // If you set BatchSize to 10, this array will have up to 10 orders.
    for (const record of event.Records) {
        try {
            // The data we sent in producer.js is inside 'body'
            const orderData = JSON.parse(record.body);

            console.log("Processing order:", orderData.orderId);

            // 2. Prepare the command to save to DynamoDB
            const params = {
                TableName: "FlashSaleOrders",
                Item: {
                    orderId: orderData.orderId,
                    item: orderData.item,
                    price: orderData.price,
                    customerEmail: orderData.customerEmail,
                    timestamp: new Date().toISOString(),
                    status: "PROCESSED"
                },
            };

            // 3. Write to the Database
            await ddbDocClient.send(new PutCommand(params));
            
            console.log(`Successfully saved order ${orderData.orderId} to DB`);

        } catch (error) {
            console.error("Error processing message:", error);
            // If we throw an error here, SQS will keep the message 
            // and try again later (Retry Logic).
            throw error; 
        }
    }
};