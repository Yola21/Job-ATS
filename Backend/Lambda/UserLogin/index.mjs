import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
  const { email, password } = JSON.parse(event.body);

  const params = {
    TableName: 'ResumeParser_Users',
    Key: {
      email,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      };
    }

    const match = await bcrypt.compare(password, result.Item.password);
    if (!match) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user: result.Item, message: 'Login successful' }),
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to log in user' }),
    };
  }
};

export {handler}