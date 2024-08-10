import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import axios from 'axios';

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const API = process.env.REACT_APP_RESUME_PARSER_API

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API}/jobs`);
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
