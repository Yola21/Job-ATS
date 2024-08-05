import AWS from 'aws-sdk';
import {v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
  console.log(event);
  const { name, email, password } = JSON.parse(event.body);

  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: 'ResumeParser_Users',
    Item: {
      userId: uuidv4(),
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      createdDate: new Date().toISOString() 
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User signed up successfully' }),
    };
  } catch (error) {
    console.error('Error signing up user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to sign up user' }),
    };
  }
};

export {handler};