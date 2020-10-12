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
        console.log(JSON.stringify(params));
        const data = await dynamoDb.get(params).promise();
        console.log(JSON.stringify(data));
        return callback(null, {result: data});
    } catch (error) {
        callback(error);
    }
};
