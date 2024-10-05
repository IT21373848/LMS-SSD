import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiUrl } from '../../utils/Constants';
import { RiFacebookBoxFill } from 'react-icons/ri';
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA

const LOCK_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const RECAPTCHA_SITE_KEY = 'your-site-key-here'; // Add your reCAPTCHA site key

export default function Login() {
  const [buttonDisable, setBtnDisabled] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null); // Track the reCAPTCHA token
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFacebookLogin = async () => {
    window.location.href = `${apiUrl}/auth/facebook`;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    // Ensure reCAPTCHA is solved
    if (!captchaToken) {
      toast.error('Please complete the reCAPTCHA.');
      setBtnDisabled(false);
      return;
    }

    const payload = { email, password, captchaToken };

    try {
      const isLoggedin = await axios.post(`${apiUrl}/login`, payload);
      if (isLoggedin) {
        Cookies.set('firstName', isLoggedin.data.firstName);

        login(isLoggedin.data.userRole, isLoggedin.data.token);

        switch (isLoggedin.data.userRole) {
          case 'admin':
            toast.success('Login Success as an Admin');
            navigate('/dashboard');
            break;
          case 'student':
            toast.success('Login Success as a Student');
            navigate('/portal');
            break;
          case 'support':
            toast.success('Login Success as Support');
            navigate('/dashboard/supoverview');
            break;
          case 'teacher':
            toast.success('Login Success as a Teacher');
            navigate('/dashboard/overview');
            break;
          case 'parent':
            toast.success('Login Success as a Parent');
            navigate('/dashboard/paroverview');
            break;
          default:
            toast.error('Invalid user role');
        }
      }
    } catch (error) {

      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.message);
      }
    } finally {
      setBtnDisabled(false);
    }
  };

  // reCAPTCHA callback
  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <Container component="main" maxWidth="xs" className="shadow-lg bg-white pt-1 pb-5">
      <CssBaseline />
      <Box
        sx={{
          padding: '20px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <Typography variant="h5" margin={'10px 0px'}>
          Dharmapala Knowledge Base
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <ReCAPTCHA
            sitekey={"6LcsWlgqAAAAADJgkLGJUofEm8ZbDdn9fhYyxlr5"} // Insert your site key here
            onChange={onCaptchaChange}  // Set reCAPTCHA token when solved
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={buttonDisable || !captchaToken} // Disable button if no token
          >
            Login
          </Button>
          <Button onClick={handleFacebookLogin}>
            <RiFacebookBoxFill size={32} />
            Login with Facebook
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
