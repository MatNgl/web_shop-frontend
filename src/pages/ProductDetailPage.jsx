import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  Alert,
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);
  const token = localStorage.getItem('token');

  // Charger le produit
  useEffect(() => {
    axios.get(`http://localhost:3000/produits/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération du produit", error);
        setLoading(false);
      });
  }, [id]);

  // Charger la wishlist (si l'utilisateur est connecté)
  useEffect(() => {
    if (token) {
      const fetchWishlist = async () => {
        try {
          const response = await axios.get('http://localhost:3000/wishlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWishlistItems(response.data.items);
        } catch (error) {
          console.error("Erreur lors du chargement de la wishlist", error);
        }
      };
      fetchWishlist();
    }
  }, [token]);

  const isInWishlist = () => {
    return wishlistItems.find(item => item.produit.id === product.id);
  };

  const handleAddToCart = () => {
    if (!token) {
      setCartMessage("Vous devez être connecté pour ajouter au panier.");
      return;
    }
    axios.post('http://localhost:3000/panier/add', 
      { produitId: Number(product.id), quantite: Number(quantity) },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setCartMessage("Produit ajouté au panier !");
        setTimeout(() => setCartMessage(""), 3000);
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout au panier", error);
        setCartMessage("Erreur lors de l'ajout au panier.");
        setTimeout(() => setCartMessage(""), 3000);
      });
  };

  const handleAddToWishlist = () => {
    if (!token) {
      setWishlistMessage("Vous devez être connecté pour ajouter à la wishlist.");
      return;
    }
    axios.post('http://localhost:3000/wishlist/add',
      { produitId: Number(product.id) },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setWishlistMessage("Produit ajouté à la wishlist !");
        // Recharger la wishlist
        axios.get('http://localhost:3000/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setWishlistItems(response.data.items))
        .catch(error => console.error(error));
        setTimeout(() => setWishlistMessage(""), 3000);
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout à la wishlist", error.response ? error.response.data : error);
        setWishlistMessage("Erreur lors de l'ajout à la wishlist.");
        setTimeout(() => setWishlistMessage(""), 3000);
      });
  };

  const handleRemoveFromWishlist = () => {
    const wishlistItem = isInWishlist();
    if (wishlistItem) {
      axios.delete(`http://localhost:3000/wishlist/${wishlistItem.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setWishlistMessage("Produit retiré de la wishlist !");
        axios.get('http://localhost:3000/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setWishlistItems(response.data.items))
        .catch(error => console.error(error));
        setTimeout(() => setWishlistMessage(""), 3000);
      })
      .catch(error => {
        console.error("Erreur lors du retrait de la wishlist", error.response ? error.response.data : error);
        setWishlistMessage("Erreur lors du retrait de la wishlist.");
        setTimeout(() => setWishlistMessage(""), 3000);
      });
    }
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

  if (!product) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">Produit non trouvé</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Card sx={{ p: 2 }}>
          {product.image && (
            <CardMedia
              component="img"
              image={product.image}
              alt={product.nom}
              sx={{ height: 300 }}
            />
          )}
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {product.nom}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.description}
            </Typography>
            <Typography variant="h6" color="primary">
              {product.prix} €
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Stock : {product.stock} pièces
              </Typography>
              {product.statuts && product.statuts.length > 0 && (
                <Typography variant="subtitle1">
                  Statut : {product.statuts.map(s => s.nom).join(', ')}
                </Typography>
              )}
              {product.promotion_id && (
                <Typography variant="subtitle1" color="secondary">
                  Promotion active (ID : {product.promotion_id})
                </Typography>
              )}
            </Box>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
            <TextField
              label="Quantité"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1 }}
              sx={{ width: 100 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddToCart}>
              Ajouter au panier
            </Button>
            {isInWishlist() ? (
              <Button variant="outlined" color="error" onClick={handleRemoveFromWishlist}>
                Retirer de la wishlist
              </Button>
            ) : (
              <Button variant="outlined" color="secondary" onClick={handleAddToWishlist}>
                Ajouter à la wishlist
              </Button>
            )}
          </Box>
          {cartMessage && <Alert severity="success" sx={{ mt: 2 }}>{cartMessage}</Alert>}
          {wishlistMessage && <Alert severity="info" sx={{ mt: 2 }}>{wishlistMessage}</Alert>}
          <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" component={Link} to="/produits">
              Retour à la liste des produits
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
};

export default ProductDetailPage;
