import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const token = localStorage.getItem("token");

  // ✅ Fonction pour corriger l'URL des images
  const getImageUrl = (image) => {
    if (!image)
      return "https://via.placeholder.com/400x300?text=Image+Non+Disponible";
    const imageUrl = typeof image === "object" ? image.url : image; // 🔥 Vérifie si c'est un objet
    return imageUrl.startsWith("/uploads")
      ? `http://localhost:3000${imageUrl}`
      : imageUrl;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/produits/${id}`)
      .then((response) => {
        const productData = response.data;
        setProduct(productData);

        // ✅ Correction ici : Vérifier que productData.images est bien une liste valide
        if (
          productData.images &&
          Array.isArray(productData.images) &&
          productData.images.length > 0
        ) {
          setSelectedImage(getImageUrl(productData.images[0]));
        } else {
          setSelectedImage(
            "https://via.placeholder.com/400x300?text=Image+Non+Disponible"
          );
        }

        axios
          .get("http://localhost:3000/produits/recommandations", {
            params: { id },
          })
          .then((res) => setRelatedProducts(res.data))
          .catch((err) =>
            console.error("Erreur chargement produits similaires", err)
          );

        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du produit", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3000/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setWishlistItems(response.data.items))
        .catch((error) =>
          console.error("Erreur lors du chargement de la wishlist", error)
        );
    }
  }, [token]);

  const isInWishlist = () => {
    return wishlistItems.some((item) => item.produit?.id === product?.id);
  };

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  const handleWishlistToggle = () => {
    if (!token) {
      showToast("Vous devez être connecté pour gérer votre wishlist.", "error");
      return;
    }
    if (isInWishlist()) {
      const wishlistItem = wishlistItems.find(
        (item) => item.produit.id === product.id
      );
      axios
        .delete(`http://localhost:3000/wishlist/${wishlistItem.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          showToast("Retiré de la wishlist !");
          setWishlistItems((prev) =>
            prev.filter((item) => item.produit.id !== product.id)
          );
        })
        .catch(() =>
          showToast("Erreur lors du retrait de la wishlist.", "error")
        );
    } else {
      axios
        .post(
          "http://localhost:3000/wishlist/add",
          { produitId: product.id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          showToast("Ajouté à la wishlist !");
          setWishlistItems([...wishlistItems, { produit: product }]);
        })
        .catch(() =>
          showToast("Erreur lors de l'ajout à la wishlist.", "error")
        );
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      showToast("Vous devez être connecté pour ajouter au panier.", "error");
      return;
    }

    axios
      .post(
        "http://localhost:3000/panier/add",
        { produitId: Number(product.id), quantite: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        showToast("Ajouté au panier !");
      })
      .catch(() => showToast("Erreur lors de l'ajout au panier.", "error"));
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Navbar />

      <Container
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* ✅ Image principale corrigée */}
        <Box sx={{ flex: 1 }}>
          <Box
            component="img"
            src={selectedImage}
            alt={product.nom}
            sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
          />
        </Box>

        {/* ✅ Informations du produit */}
        <Box sx={{ flex: 1 }}>
          {/* ✅ Titre avec wishlist */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4">{product.nom}</Typography>
            <IconButton onClick={handleWishlistToggle}>
              <FavoriteIcon
                sx={{ color: isInWishlist() ? "red" : "gray", fontSize: 32 }}
              />
            </IconButton>
          </Box>

          <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
            {product.prix} €
          </Typography>
          <Typography
            sx={{
              mt: 1,
              fontStyle: "italic",
              color: product.stock > 0 ? "green" : "red",
            }}
          >
            {product.stock > 0 ? "En stock" : "Rupture de stock"}
          </Typography>
          <Typography sx={{ mt: 2 }}>{product.description}</Typography>

          <Typography sx={{ mt: 3, fontWeight: "bold" }}>Quantité</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 1,
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: "5px 10px",
              width: "fit-content",
            }}
          >
            <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <RemoveIcon />
            </IconButton>
            <Typography>{quantity}</Typography>
            <IconButton onClick={() => setQuantity(quantity + 1)}>
              <AddIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            sx={{ mt: 3, width: "100%" }}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            Ajouter au panier
          </Button>
        </Box>
      </Container>

      {/* ✅ Toast pour notifications */}
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ open: false, message: "", type: "success" })}
      />
    </>
  );
};

export default ProductDetailPage;
