import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast"; // ✅ Importation du Toast

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [inWishlist, setInWishlist] = useState(false);
  const [hoverWishlist, setHoverWishlist] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const found = res.data.items.find((item) => item.produit.id === product.id);
          setInWishlist(!!found);
        })
        .catch((error) => console.error("Erreur chargement wishlist", error));
    }
  }, [token, product.id]);

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) {
      showToast("Vous devez être connecté pour utiliser la wishlist.", "error");
      return;
    }

    try {
      if (inWishlist) {
        const wishlistRes = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlistItem = wishlistRes.data.items.find((item) => item.produit.id === product.id);

        if (wishlistItem) {
          await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/wishlist/${wishlistItem.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          showToast("Retiré de la wishlist.");
        }
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/wishlist/add`, 
          { produitId: Number(product.id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast("Ajouté à la wishlist !");
      }
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error("Erreur wishlist", error);
      showToast("Erreur lors de la mise à jour de la wishlist.", "error");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!token) {
      showToast("Vous devez être connecté pour ajouter au panier.", "error");
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/panier/add`,
        { produitId: Number(product.id), quantite: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        showToast("Ajouté au panier !");
      })
      .catch(() => showToast("Erreur lors de l'ajout au panier.", "error"));
  };

  const handleCardClick = () => {
    navigate(`/produits/${product.id}`);
  };

  // ✅ Gestion correcte des images sans modifications
  const images = product.images || [];
  const firstImage = images[0] ? (typeof images[0] === "object" ? images[0].url : images[0]) : "https://via.placeholder.com/300x200?text=Produit";
  const secondImage = images[1] ? (typeof images[1] === "object" ? images[1].url : images[1]) : firstImage;

  const buildImageUrl = (url) => (url && url.startsWith("/uploads") ? `http://localhost:3000${url}` : url);
  const displayedImage = hovered ? buildImageUrl(secondImage) : buildImageUrl(firstImage);

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          position: "relative",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 4,
          },
        }}
        onClick={handleCardClick}
      >
        <CardActionArea onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <CardMedia component="img" height="200" image={displayedImage} alt={product.nom} sx={{ transition: "opacity 0.3s ease-in-out" }} />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {product.nom}
            </Typography>
            <Typography variant="body1" color="primary">
              {product.prix} €
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleAddToCart} variant="contained" color="primary">
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Ajouter au panier
          </Button>

          <IconButton 
            onClick={toggleWishlist} 
            onMouseEnter={() => setHoverWishlist(true)} 
            onMouseLeave={() => setHoverWishlist(false)}
            sx={{
              color: inWishlist ? "red" : "gray",
              transition: "transform 0.2s ease-in-out, color 0.2s",
              "&:hover": { color: inWishlist ? "red" : "#ff1744", transform: "scale(1.2)" },
            }}
          >
            {hoverWishlist && inWishlist ? <CancelIcon sx={{ fontSize: 28 }} /> : <FavoriteIcon sx={{ fontSize: 28 }} />}
          </IconButton>
        </CardActions>
      </Card>

      {/* ✅ Toast bien intégré sans toucher aux images */}
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ open: false, message: "", type: "success" })} />
    </>
  );
};

export default ProductCard;
