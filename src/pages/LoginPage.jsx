import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Fade,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      const { access_token, user } = response.data;
      if (access_token) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      }
    } catch (err) {
      console.error('Erreur de connexion :', err);
      setError("Identifiants invalides");
    }
  };

  return (
    <Fade in timeout={500}>
      <Container
        maxWidth="xs"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" component="h1" textAlign="center" mb={2}>
            Se connecter
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Adresse email"
              variant="outlined"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Mot de passe"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 'bold',
                ':hover': { transform: 'scale(1.02)' },
                transition: 'transform 0.2s',
              }}
            >
              Se connecter
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2}>
            Nouveau ici ?{' '}
            <Link to="/register" style={{ color: '#1976d2' }}>
              Créer un compte
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Fade>
  );
}

export default LoginPage;
