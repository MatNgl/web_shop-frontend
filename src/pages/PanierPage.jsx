// src/pages/PanierPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PanierPage = () => {
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchPanier = () => {
    axios
      .get('http://localhost:3000/panier', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPanier(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du panier", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPanier();
  }, [token]);

  const handleUpdateQuantity = (articleId, newQuantity) => {
    axios
      .patch(`http://localhost:3000/panier/update-quantity/${articleId}`, { quantite: Number(newQuantity) }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUpdateMessage('Quantité mise à jour');
        fetchPanier();
        setTimeout(() => setUpdateMessage(''), 3000);
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de la quantité", error);
        setUpdateMessage('Erreur de mise à jour');
        setTimeout(() => setUpdateMessage(''), 3000);
      });
  };

  const handleRemoveArticle = (articleId) => {
    axios
      .delete(`http://localhost:3000/panier/remove/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUpdateMessage('Article supprimé');
        fetchPanier();
        setTimeout(() => setUpdateMessage(''), 3000);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'article", error);
        setUpdateMessage('Erreur lors de la suppression');
        setTimeout(() => setUpdateMessage(''), 3000);
      });
  };

  // Calculer le total du panier
  const calculateTotal = () => {
    if (!panier || !panier.articles || panier.articles.length === 0) return 0;
    return panier.articles.reduce((acc, article) => {
      const prix = parseFloat(article.produit.prix);
      return acc + (prix * article.quantite);
    }, 0);
  };

  const handleCheckout = () => {
    // Redirige vers la page de checkout
    navigate('/checkout');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mon Panier
        </Typography>
        {updateMessage && <Alert severity="info">{updateMessage}</Alert>}
        {panier?.articles && panier.articles.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {panier.articles.map((article) => (
                <Grid item xs={12} key={article.id}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <CardMedia
                      component="img"
                      image={article.produit.image || "https://via.placeholder.com/150?text=Produit"}
                      alt={article.produit.nom}
                      sx={{ width: 150, height: 150, objectFit: 'cover' }}
                    />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h6">{article.produit.nom}</Typography>
                      <Typography variant="body2">
                        Prix : {article.produit.prix} €
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TextField
                          label="Quantité"
                          type="number"
                          value={article.quantite}
                          onChange={(e) => handleUpdateQuantity(article.id, e.target.value)}
                          inputProps={{ min: 1 }}
                          sx={{ width: 100 }}
                        />
                        <Button variant="outlined" color="error" sx={{ ml: 2 }} onClick={() => handleRemoveArticle(article.id)}>
                          Supprimer
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
              Total : {calculateTotal().toFixed(2)} €
            </Typography>
            <Button variant="contained" color="primary" fullWidth onClick={handleCheckout}>
              Passer la commande
            </Button>
          </>
        ) : (
          <Typography variant="h6">Votre panier est vide.</Typography>
        )}
      </Container>
    </>
  );
};

export default PanierPage;
