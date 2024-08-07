// src/components/JobDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    jobId: '',
    company: '',
    description: '',
    location: '',
    title: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    // const response = await axios.get('https://6akzx62xwi.execute-api.us-east-1.amazonaws.com/dev/jobs');
    const response = await axios.get('https://fyasa2z8jh.execute-api.us-east-1.amazonaws.com/prod/jobs');
    console.log(response)
    const data = JSON.parse(response.data.body)
    setJobs(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    if (isEditing) {
      await axios.put('https://fyasa2z8jh.execute-api.us-east-1.amazonaws.com/prod/jobs', formData);
    } else {
      await axios.post('https://fyasa2z8jh.execute-api.us-east-1.amazonaws.com/prod/jobs', formData);
    }
    fetchJobs();
    setFormData({ jobId: '', company: '', description: '', location: '', title: '' });
    setIsEditing(false);
  };

  const handleEdit = (job) => {
    setFormData(job);
    setIsEditing(true);
  };

  const handleDelete = async (e, jobId) => {
    console.log(jobId)
    await axios.delete('https://fyasa2z8jh.execute-api.us-east-1.amazonaws.com/prod/jobs', {jobId: jobId});
    fetchJobs();
  };

  return (
    <div>
      <h2>Job Dashboard</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdate(); }}>
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {jobs.map((job) => (
          <li key={job.jobId}>
            {job.title} - {job.company}
            <button onClick={() => handleEdit(job)}>Edit</button>
            <button onClick={(e) => handleDelete(e, job.jobId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
