// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress } from '@mui/material';
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
      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Bienvenue sur web_shop
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Découvrez nos produits et profitez de nos offres exceptionnelles.
        </Typography>
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={4}>
            {products.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default HomePage;
