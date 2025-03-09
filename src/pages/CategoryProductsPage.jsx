// src/pages/CategoryProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const CategoryProductsPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Charger les détails de la catégorie
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories/${id}`)
      .then(response => {
        setCategory(response.data);
        setLoadingCategory(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement de la catégorie", error);
        setLoadingCategory(false);
      });
  }, [id]);

  // Charger les produits associés à la catégorie
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories/${id}/products`)
      .then(response => {
        setProducts(response.data);
        setLoadingProducts(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des produits de la catégorie", error);
        setLoadingProducts(false);
      });
  }, [id]);

  if (loadingCategory || loadingProducts) {
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
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Produits de la catégorie {category?.nom || id}
        </Typography>
        <Grid container spacing={4}>
          {products.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default CategoryProductsPage;
