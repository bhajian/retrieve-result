'use strict';

const AWS = require('aws-sdk');
var path = require('path');

const { REGION: region, S3_BUCKET_NAME: bucketName,
    SSM_PATH: ssmPath} = process.env;
AWS.config.update({region: region});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ssm = new AWS.SSM();

module.exports.handle = async (event, context, callback) => {

    let req = {
        Name: path.join(ssmPath, 'FILE_TABLE_NAME'),
        WithDecryption: false
    };
    const data = await ssm.getParameter(req).promise();

    const params = {
        TableName: data.Parameter.Value,
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
