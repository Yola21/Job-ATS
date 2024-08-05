import AWS from 'aws-sdk';
import {v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3();
const textract = new AWS.Textract();

const handler = async (event) => {
  console.log("Event received:", event);
  
  try {
    const { fileContent } = event;
    if (!fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'File name and content are required' }),
      };
    }

    const bucketName = 'resume-parser-term-project-s3';

    const key = `resumes/${uuidv4()}.pdf`;

    const s3Params = {
      Bucket: bucketName,
      Key: key,
      Body: Buffer.from(fileContent, 'base64'),
      ContentType: 'application/pdf',
    };

    console.log("Uploading to S3 with params:", s3Params);
    const responseFromS3 = await s3.upload(s3Params).promise();
    console.log("File uploaded to S3", responseFromS3);

    const dataFromS3 = responseFromS3?.key;
    console.log(dataFromS3);

    const data = await s3.getObject({
      Bucket: bucketName,
      Key: key,
    }).promise();

    console.log({ data });
    const fileContentS3 = data.Body;
    console.log({ fileContentS3 });

    const textractParams = {
      Document: {
        Bytes: fileContentS3,
      },
      FeatureTypes: ["LAYOUT"],
    };

    console.log("Starting Textract analysis with params:", textractParams);
    const textractResult = await textract.analyzeDocument(textractParams).promise();
    console.log("Textract result:", textractResult);

    const extractedData = extractInformationFromTextractResponse(textractResult);
    console.log({ extractedData });

    return {
      statusCode: 200,
      body: JSON.stringify({ extractedData }),
    };
  } catch (error) {
    console.error('Error processing resume:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process resume' }),
    };
  }
};

function extractInformationFromTextractResponse(response) {
  let name = "";
  let email = "";
  let githubLink = "";
  let linkedinLink = "";
  let phone = "";
  let education = "";
  let skills = "";
  let experience = "";

  response.Blocks.forEach((block) => {
    if (block.BlockType === "LINE") {
      const text = block.Text.toLowerCase();

      if (!name) {
        name = block.Text;
      }

      if (text.includes("@") && text.includes(".")) {
        email = text;
      }

      if (text.includes("github.com")) {
        githubLink = text;
      }

      if (text.includes("linkedin.com")) {
        linkedinLink = text;
      }

      if (text.match(/\d{10}/)) {
        phone = text;
      }

      if (text.includes("education")) {
        education += text + "\n";
      }
      if (text.includes("skills")) {
        skills += text + "\n";
      }
      if (text.includes("experience")) {
        experience += text + "\n";
      }
    }
  });

  return {
    name,
    email,
    githubLink,
    linkedinLink,
    phone,
    education,
    skills,
    experience,
  };
}

export { handler };


