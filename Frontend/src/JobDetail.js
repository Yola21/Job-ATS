import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Typography, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function JobDetail() {
  const [job, setJob] = useState({});
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    github: '',
    linkedin: '',
    phone: '',
    education: '',
    skills: '',
    experience: '',
  });
  const { jobId } = useParams();
  const API = process.env.REACT_APP_RESUME_PARSER_API
  console.log(jobId);

  const fetchJob = async () => {
    try {
      const response = await axios.post(`${API}/job/`, {
        body: JSON.stringify({ jobId }),
      });
      console.log(response);
      const data = JSON.parse(response.data.body);
      console.log(data);
      setJob(data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Get Base64 data
        setResume({
          fileName: file.name,
          fileContent: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (resume) {
      setLoading(true);
      try {
        const response = await axios.post(`${API}/extract`, {
          fileName: resume.fileName,
          fileContent: resume.fileContent,
        });

        console.log(response);
        console.log(JSON.parse(response.data.body));
        const { extractedData } = JSON.parse(response.data.body);
        setFormData({
          name: extractedData.name || "",
          email: extractedData.email || "",
          github: extractedData.githubLink || "",
          linkedin: extractedData.linkedinLink || "",
          phone: extractedData.phone || "",
          education: extractedData.education || "",
          skills: extractedData.skills || "",
          experience: extractedData.experience || "",
        });
        toast.success("Text extracted successfully from Resume!");
      } catch (error) {
        console.error("Error extracting data from resume:", error);
        toast.error("Failed to extract text from resume.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please select a resume to upload.");
    }
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleApplyForJob = async () => {
    const body = { ...formData, jobId, 
      userEmail: localStorage.getItem("userEmail") };

    try {
      await axios.post(`${API}/apply`, {
        body: JSON.stringify(body),
      });
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to submit application. Please try again later.");
    }
  };

  return (
    <Grid container spacing={2} style={{ padding: '2rem' }}>
      <Typography variant="h4">{job.title}</Typography>
      <Typography variant="body1">{job.description}</Typography>
      <Typography variant="h6">Apply for Job</Typography>
      <Grid item xs={6}>
        <input type="file" onChange={handleResumeChange} />
        {/* <input type="file" accept=".pdf" onChange={handleResumeChange} /> */}
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleExtract}>
          Upload Resume
        </Button>
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
      {!loading && (
        <>
          {Object.entries(formData).map(([key, value]) => (
            <Grid item xs={6} key={key}>
              <TextField
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                variant="outlined"
                fullWidth
                name={key}
                value={value}
                onChange={handleFormDataChange}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyForJob}
              disabled={!formData.email}>
              Apply for Job
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default JobDetail;
