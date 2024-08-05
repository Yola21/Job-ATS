import AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({ region: 'us-east-1' });

const handler = async (event) => {
    console.log(event);
  const { jobId } = JSON.parse(event.body);

  if (!jobId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Job ID is required' }),
    };
  }

  const params = {
    TableName: 'ResumeParser_Jobs',
    Key: {
      jobId: jobId,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Job not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error('Error fetching job detail:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch job detail' }),
    };
  }
};

export {handler};