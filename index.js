'use strict';

const AWS = require('aws-sdk');
const { REGION: region, S3_BUCKET_NAME: bucketName,
    FILE_TABLE_NAME: fileTableName} = process.env;
AWS.config.update({region: region});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handle = async (event, context, callback) => {
    const params = {
        TableName: fileTableName,
        Key: {
            ID: event.pathParameters.id,
        },
    };
    try {
        const data = await dynamoDb.get(params).promise();
        console.log(JSON.stringify(data));
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(data),
        };
        return callback(null, response);
    } catch (error) {
        callback(error);
    }
};
