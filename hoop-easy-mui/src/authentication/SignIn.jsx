import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import { loginUser } from './Authentication';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';


export default function SignIn({ getUser }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState("")
  const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); 
        setErrorMessage(''); 
        try {
            const data = new FormData(event.currentTarget);
            const userCredential = await loginUser(data.get('email'), data.get('password'));

            if (userCredential.user.emailVerified) {
                await getUser(data.get('email'))
                navigate('/homepage');
            } else {
                setErrorMessage('Please verify your email');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('An error occurred while logging in');
        } finally {
            setLoading(false); 
        }
    };
    
    if (loading) return <Alert>Loading...</Alert>
 

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                {errorMessage === "" ? "Sign in" : errorMessage}

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
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontWeight: theme.typography.fontWeightMedium }}
                >
                Sign In
                </Button>
                <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                    Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/createAccount" variant="body2">
                    {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
        </Container>
    );
}