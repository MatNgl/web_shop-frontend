// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  Box,
  Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [inWishlist, setInWishlist] = useState(false);
  const [message, setMessage] = useState('');

  // Vérifier la présence du produit dans la wishlist
  useEffect(() => {
    if (token) {
      const fetchWishlist = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/wishlist`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const found = response.data.items.find(
            (item) => item.produit.id === product.id
          );
          setInWishlist(!!found);
        } catch (error) {
          console.error("Erreur lors du chargement de la wishlist", error);
        }
      };
      fetchWishlist();
    }
  }, [token, product.id]);

  // Gérer l'ajout ou le retrait de la wishlist
  const handleWishlistClick = async (e) => {
    // Empêche le clic de se propager à la carte
    e.stopPropagation();
    if (!token) {
      setMessage("Vous devez être connecté pour utiliser la wishlist.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (inWishlist) {
      // Retirer du wishlist
      try {
        const wishlistResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/wishlist`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const wishlistItem = wishlistResponse.data.items.find(
          (item) => item.produit.id === product.id
        );
        if (wishlistItem) {
          await axios.delete(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/wishlist/${wishlistItem.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setInWishlist(false);
          setMessage("Retiré de la wishlist.");
        }
      } catch (error) {
        console.error("Erreur lors du retrait de la wishlist", error.response ? error.response.data : error);
        setMessage("Erreur lors du retrait de la wishlist.");
      }
    } else {
      // Ajouter à la wishlist
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/wishlist/add`,
          { produitId: Number(product.id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInWishlist(true);
        setMessage("Ajouté à la wishlist.");
      } catch (error) {
        console.error("Erreur lors de l'ajout à la wishlist", error.response ? error.response.data : error);
        setMessage("Erreur lors de l'ajout à la wishlist.");
      }
    }
    setTimeout(() => setMessage(""), 2000);
  };

  // Gérer l'ajout direct au panier
  const handleAddToCart = (e) => {
    // Empêche le clic de se propager à la carte
    e.stopPropagation();
    if (!token) {
      setMessage("Vous devez être connecté pour ajouter au panier.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/panier/add`,
      { produitId: Number(product.id), quantite: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setMessage("Ajouté au panier !");
        setTimeout(() => setMessage(""), 2000);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout au panier", error.response ? error.response.data : error);
        setMessage("Erreur lors de l'ajout au panier.");
        setTimeout(() => setMessage(""), 2000);
      });
  };

  // Si l'utilisateur clique sur la carte (en dehors des boutons), naviguer vers la page de détail du produit
  const handleCardClick = () => {
    navigate(`/produits/${product.id}`);
  };

  return (
    <Card sx={{ maxWidth: 345, position: 'relative' }} onClick={handleCardClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={product.image || "https://via.placeholder.com/300x200?text=Produit"}
          alt={product.nom}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.nom}
          </Typography>
          <Typography variant="body1" color="primary">
            {product.prix} €
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={handleAddToCart} variant="contained" color="primary">
          Ajouter au panier
        </Button>
        <IconButton onClick={handleWishlistClick}>
          <FavoriteIcon color={inWishlist ? "error" : "inherit"} />
        </IconButton>
      </CardActions>
      {message && (
        <Box sx={{ p: 1 }}>
          <Alert severity="info">{message}</Alert>
        </Box>
      )}
    </Card>
  );
};

export default ProductCard;
