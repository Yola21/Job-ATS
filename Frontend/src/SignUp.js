import React, { useState } from 'react';
import { Button, TextField, Grid, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import axios from 'axios';
import {useHistory} from "react-router-dom";

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useHistory();
  const API = process.env.REACT_APP_RESUME_PARSER_API

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const body = {
      name,
      email,
      password
    };

    try {
      const response = await axios.post(`${API}/register`, 
        {
          body: JSON.stringify(body)
        }
      );
      console.log(response)
      if(response.data.statusCode === 200){
        toast.success("Sign-up successful! Please log in.");
        history.push("/")
      }
    } catch (error) {
      toast.error("Sign-up failed. Please try again.");
    }
  };

  return (
    <Grid container spacing={2} style={{ padding: '2rem' }}>
      <Typography variant="h4">Sign Up</Typography>
      <Grid item xs={12}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Grid>
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
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSignUp}>
          Sign Up
        </Button>
      </Grid>
    </Grid>
  );
}

export default SignUp;
