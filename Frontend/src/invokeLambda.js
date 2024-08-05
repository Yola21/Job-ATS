export const uploadResume = async (fileContent, fileName) => {
  const response = await fetch('https://your-api-id.execute-api.region.amazonaws.com/prod/uploadResume', {
    method: 'POST',
    body: JSON.stringify({ fileContent, fileName }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload resume');
  }

  return response.json();
};

export const extractText = async (fileName) => {
  const response = await fetch('https://your-api-id.execute-api.region.amazonaws.com/prod/extractText', {
    method: 'POST',
    body: JSON.stringify({ fileName }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to extract text');
  }

  return response.json();
};

export const applyForJob = async (applicationData) => {
  const response = await fetch('https://your-api-id.execute-api.region.amazonaws.com/prod/applyForJob', {
    method: 'POST',
    body: JSON.stringify(applicationData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to apply for job');
  }

  return response.json();
};

export const getJobs = async () => {
  const response = await fetch('https://your-api-id.execute-api.region.amazonaws.com/prod/getJobs', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return response.json();
};
