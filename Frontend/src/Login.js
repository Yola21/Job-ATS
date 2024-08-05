import React, { useState } from 'react';
import { Button, TextField, Grid, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const body = {email, password};

    try {
      // const response = await axios.post('https://0clhmec728.execute-api.us-east-1.amazonaws.com/prod/login', {
      const response = await axios.post('https://fyasa2z8jh.execute-api.us-east-1.amazonaws.com/prod/login', {
        body: JSON.stringify(body)
      });
      console.log(response);
      const data = JSON.parse(response.data.body);

      if(response.status === 200){
        toast.success("Login successful!");
        localStorage.setItem("userEmail", data?.user?.email)
        localStorage.setItem("isAdmin", data?.user?.isAdmin)
        window.location.href = '/jobs';
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <Grid container spacing={2} style={{ padding: '2rem' }}>
      <Typography variant="h4">Login</Typography>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Grid>
    </Grid>
  );
}

export default Login;
