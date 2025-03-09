import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
  });
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  // État pour la mise à jour du mot de passe
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  // États pour gérer la visibilité des mots de passe
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Chargement du profil utilisateur lors du montage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get('http://localhost:3000/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setProfileForm({
          prenom: response.data.prenom || '',
          nom: response.data.nom || '',
          email: response.data.email || '',
          telephone: response.data.telephone || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement du profil', error);
        setProfileMessage({ text: "Erreur lors du chargement du profil", type: "error" });
        setLoading(false);
      });
  }, [navigate]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const validateProfileForm = () => {
    if (!profileForm.prenom.trim() || !profileForm.nom.trim() || !profileForm.telephone.trim()) {
      setProfileMessage({ text: "Tous les champs doivent être remplis.", type: "error" });
      return false;
    }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(profileForm.telephone)) {
      setProfileMessage({ text: "Le téléphone doit comporter 10 chiffres et commencer par 0.", type: "error" });
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ text: "", type: "" });
    if (!validateProfileForm()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('http://localhost:3000/users/profile', profileForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setProfileMessage({ text: "Profil mis à jour avec succès.", type: "success" });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      setProfileMessage({ text: "Erreur lors de la mise à jour du profil.", type: "error" });
    }
  };

  const validatePasswordForm = () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage({ text: "Tous les champs du mot de passe doivent être remplis.", type: "error" });
      return false;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: "Les mots de passe ne correspondent pas.", type: "error" });
      return false;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ text: "Le nouveau mot de passe doit comporter au moins 6 caractères.", type: "error" });
      return false;
    }
    return true;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: "", type: "" });
    if (!validatePasswordForm()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3000/users/password', passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordMessage({ text: "Mot de passe mis à jour avec succès.", type: "success" });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe", error);
      setPasswordMessage({ text: "Erreur lors de la mise à jour du mot de passe.", type: "error" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6" align="center">
            Chargement...
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 3 }}>
          {/* Titre de la page */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            Mon Profil
          </Typography>

          {/* Formulaire de mise à jour du profil */}
          <Typography variant="h6" gutterBottom>
            Mettre à jour votre profil
          </Typography>
          <form onSubmit={handleUpdateProfile}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <TextField
                label="Prénom"
                name="prenom"
                value={profileForm.prenom}
                onChange={handleProfileChange}
                fullWidth
                required
              />
              <TextField
                label="Nom"
                name="nom"
                value={profileForm.nom}
                onChange={handleProfileChange}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <TextField
                label="Email"
                name="email"
                value={profileForm.email}
                fullWidth
                disabled
                helperText="L'email ne peut pas être modifié"
              />
              <TextField
                label="Téléphone"
                name="telephone"
                value={profileForm.telephone}
                onChange={handleProfileChange}
                fullWidth
                required
                helperText="Doit comporter 10 chiffres et commencer par 0"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontWeight: 'bold', transition: 'all 0.2s', "&:hover": { transform: "scale(1.03)" } }}
            >
              Mettre à jour
            </Button>
          </form>
          {profileMessage.text && (
            <Typography
              variant="body1"
              sx={{ mt: 2, color: profileMessage.type === 'error' ? 'error.main' : 'success.main', fontWeight: 'medium' }}
            >
              {profileMessage.text}
            </Typography>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Formulaire de mise à jour du mot de passe */}
          <Typography variant="h6" gutterBottom>
            Mettre à jour votre mot de passe
          </Typography>
          <form onSubmit={handleUpdatePassword}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <TextField
                label="Ancien mot de passe"
                name="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Nouveau mot de passe"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                helperText="Minimum 6 caractères"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirmer le nouveau mot de passe"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontWeight: 'bold', transition: 'all 0.2s', "&:hover": { transform: "scale(1.03)" } }}
            >
              Mettre à jour le mot de passe
            </Button>
          </form>
          {passwordMessage.text && (
            <Typography
              variant="body1"
              sx={{ mt: 2, color: passwordMessage.type === 'error' ? 'error.main' : 'success.main', fontWeight: 'medium' }}
            >
              {passwordMessage.text}
            </Typography>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Navigation vers d'autres sections */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
            <Button component={Link} to="/wishlist" variant="outlined" sx={{ transition: 'all 0.2s', "&:hover": { transform: "scale(1.05)" } }}>
              Wishlist
            </Button>
            <Button component={Link} to="/panier" variant="outlined" sx={{ transition: 'all 0.2s', "&:hover": { transform: "scale(1.05)" } }}>
              Panier
            </Button>
            <Button component={Link} to="/orders" variant="outlined" sx={{ transition: 'all 0.2s', "&:hover": { transform: "scale(1.05)" } }}>
              Commandes
            </Button>
            <Button component={Link} to="/payment-methods" variant="outlined" sx={{ transition: 'all 0.2s', "&:hover": { transform: "scale(1.05)" } }}>
              Moyens de paiement
            </Button>
            <Button component={Link} to="/addresses" variant="outlined" sx={{ transition: 'all 0.2s', "&:hover": { transform: "scale(1.05)" } }}>
              Adresses
            </Button>
          </Box>

          {/* Bouton de déconnexion en bas, en rouge */}
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleLogout}
              sx={{ py: 1.5, fontWeight: 'bold', transition: 'all 0.2s', "&:hover": { transform: "scale(1.03)" } }}
            >
              Déconnexion
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default ProfilePage;
