import React, { useState } from 'react';
import { Button, TextField, Grid, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API = process.env.REACT_APP_RESUME_PARSER_API

  const handleLogin = async () => {
    const body = {email, password};

    try {
      const response = await axios.post(`${API}/login`, {
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

  const handleSignUp = () => {
    window.location.href = "/signup"
  }

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
      <Grid item style={{display: 'flex', flexDirection: 'column'}}>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="contained" color="default" style={{marginTop: '1rem'}} onClick={handleSignUp}>
          Signup
        </Button>
      </Grid>
    </Grid>
  );
}

export default Login;
