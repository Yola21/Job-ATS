import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
    console.log(event)
  const { company, description, location, title } = event;
  const postedDate = new Date().toISOString();

  const params = {
    TableName: 'ResumeParser_Jobs',
    Item: {
      jobId : uuidv4(),
      company,
      description,
      location,
      postedDate,
      title,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Job added successfully', jobId }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add job', error }),
    };
  }
};

export {handler};