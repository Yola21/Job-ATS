import AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
    console.log(event)
  const { jobId, company, description, location, title } = event;

  const params = {
    TableName: 'ResumeParser_Jobs',
    Key: { jobId },
    UpdateExpression: 'set company = :c, description = :d, location = :l, title = :t',
    ExpressionAttributeValues: {
      ':c': company,
      ':d': description,
      ':l': location,
      ':t': title,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Job updated successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update job', error }),
    };
  }
};

export {handler}