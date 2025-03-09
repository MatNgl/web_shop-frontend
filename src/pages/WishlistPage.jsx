// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const fetchWishlist = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/wishlist`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setWishlist(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Erreur lors du chargement de la wishlist", error);
          setLoading(false);
        }
      };
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Ma Wishlist
        </Typography>
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : wishlist && wishlist.items && wishlist.items.length > 0 ? (
          <Grid container spacing={4}>
            {wishlist.items.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                {/* On passe l'objet produit à ProductCard */}
                <ProductCard product={item.produit} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center">
            Votre wishlist est vide.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default WishlistPage;
