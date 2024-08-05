import AWS from 'aws-sdk';
import {v4 as uuidv4 } from 'uuid';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
  console.log(event);
  console.log(JSON.parse(event.body))
  const { jobId, userEmail } = JSON.parse(event.body);
  console.log(userEmail, jobId)

  if (!jobId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Job ID is required' }),
    };
  }

  const applicationId = uuidv4();
  const applicationDate = new Date().toISOString();

  const params = {
    TableName: 'ResumeParser_JobApplications',
    Item: {
      applicationId,
      userEmail,
      jobId,
      applicationDate,
      status: 'Applied',
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Application submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error applying for job:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to apply for job' }),
    };
  }
};

export {handler};
