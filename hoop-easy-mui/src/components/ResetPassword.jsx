import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography } from "@mui/material";

export default function ResetPassword() {
  const history = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter a valid email");
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Check your email");
      history("/");
    } catch (err) {
      alert(err.code);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
          Reset
        </Button>
      </form>
    </Container>
  );
}
