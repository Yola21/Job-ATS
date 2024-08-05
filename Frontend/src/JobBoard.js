import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import axios from 'axios';

function JobBoard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // const response = await axios.get('https://6akzx62xwi.execute-api.us-east-1.amazonaws.com/dev/jobs');
        const response = await axios.get('https://fyasa2z8jh.execute-api.us-east-1.amazonaws.com/prod/jobs');
        console.log(JSON.parse(response.data.body));
        const data = JSON.parse(response.data.body);
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Grid container spacing={2} style={{ padding: '2rem' }}>
      <Typography variant="h4">Job Board</Typography>
      {jobs.map((job) => (
        <Grid item xs={12} key={job.jobId}>
          <Typography variant="h6">
            <Link to={`/jobs/${job.jobId}`}>{job.title}</Link>
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}

export default JobBoard;
