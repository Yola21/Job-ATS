import AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
    console.log(event);
    const { jobId } = event;

    const params = {
        TableName: 'ResumeParser_Jobs',
        Key: { jobId },
    };

    try {
        await dynamoDb.delete(params).promise();
        return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Job deleted successfully' }),
        };
    } catch (error) {
        return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to delete job', error }),
        };
    }
};

export {handler}