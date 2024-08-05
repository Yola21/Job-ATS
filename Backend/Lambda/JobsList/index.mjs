import AWS from 'aws-sdk';
import {v4 as uuidv4 } from 'uuid';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const hardcodedJobs = [
  { jobId: uuidv4(), title: 'Software Engineer', description: 'Develop and maintain software solutions.', company: 'Tech Corp', location: 'Toronto, ON', postedDate: new Date('2024-07-26').toISOString() },
  { jobId: uuidv4(), title: 'Data Scientist', description: 'Analyze data to gain insights and inform decisions.', company: 'Data Inc', location: 'Vancouver, BC', postedDate: new Date('2024-08-01').toISOString() },
  { jobId: uuidv4(), title: 'Product Manager', description: 'Oversee the development and lifecycle of products.', company: 'Productify', location: 'Halifax, NS', postedDate: new Date('2024-07-28').toISOString() },
];

const handler = async (event) => {
  const params = {
    TableName: 'ResumeParser_Jobs',
  };

  try {
    const data = await dynamoDb.scan(params).promise();

    if (data.Items.length === 0) {
      const putRequests = hardcodedJobs.map(job => ({
        PutRequest: {
          Item: job,
        },
      }));

      const batchWriteParams = {
        RequestItems: {
          'ResumeParser_Jobs': putRequests,
        },
      };

      await dynamoDb.batchWrite(batchWriteParams).promise();
    }

    const allJobs = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(allJobs.Items),
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch jobs' }),
    };
  }
};

export {handler};