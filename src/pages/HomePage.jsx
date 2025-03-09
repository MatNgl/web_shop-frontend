import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/produits')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des produits", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Message d'accueil */}
      <Container sx={{ mt: 4, textAlign: 'center', py: 6, background: 'linear-gradient(to right, #6a11cb, #2575fc)', borderRadius: '8px', color: 'white' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', animation: 'fadeIn 1s ease-in-out' }}>
          Bienvenue sur <span style={{ color: '#FFD700' }}>web_shop</span>
        </Typography>
        <Typography variant="h6" gutterBottom>
          Découvrez nos produits et profitez de nos offres exceptionnelles.
        </Typography>
      </Container>

      {/* Section Produits */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Nos Produits
        </Typography>

        {loading ? (
          // Affichage du spinner de chargement
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length > 0 ? (
          // Affichage de la grille des produits
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          // Message si aucun produit disponible
          <Typography variant="h6" align="center" sx={{ color: 'gray', mt: 2 }}>
            Aucun produit disponible pour le moment.
          </Typography>
        )}
      </Container>
    </>
  );
}

export default HomePage;
