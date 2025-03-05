import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Fade,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      // Remplacez l'URL par celle de votre backend NestJS
      await axios.post('http://localhost:3000/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      // Redirection vers la page de connexion après inscription
      navigate('/login');
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      setError("Erreur lors de l'inscription.");
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
            S'inscrire
          </Typography>

          <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nom"
              name="name"
              variant="outlined"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Adresse email"
              name="email"
              variant="outlined"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              label="Mot de passe"
              name="password"
              variant="outlined"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              label="Confirmer le mot de passe"
              name="confirmPassword"
              variant="outlined"
              type="password"
              fullWidth
              required
              value={formData.confirmPassword}
              onChange={handleChange}
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
              S'inscrire
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#1976d2' }}>
              Se connecter
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Fade>
  );
}

export default RegisterPage;
