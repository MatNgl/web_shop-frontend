// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  TextField,
  Autocomplete,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Récupération des catégories depuis le backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Recherche en temps réel avec debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        axios
          .get(`http://localhost:3000/produits/search?nom=${encodeURIComponent(searchTerm)}`)
          .then((response) => {
            setSearchResults(response.data);
          })
          .catch((error) => {
            console.error('Erreur lors de la recherche de produits', error);
          });
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchSelect = (event, value) => {
    if (value && value.id) {
      navigate(`/produits/${value.id}`);
    }
  };

  // La recherche est lancée lorsqu'on clique sur l'icône de loupe
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/produits/search?nom=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar>
        {/* Partie gauche : Titre */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            web_shop
          </Typography>
        </Box>

        {/* Partie centrale : Catégories et Recherche */}
        <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button color="inherit" onClick={handleMenuOpen}>
            Catégories
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                onClick={handleMenuClose}
                component={Link}
                to={`/categories/${category.id}/products`}
              >
                {category.nom || `Catégorie ${category.id}`}
              </MenuItem>
            ))}
          </Menu>
          <Autocomplete
            freeSolo
            options={searchResults}
            getOptionLabel={(option) => option.nom || ''}
            onChange={handleSearchSelect}
            inputValue={searchTerm}
            onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
            renderInput={(params) => (
              <TextField 
                {...params}
                placeholder="Rechercher un produit"
                variant="outlined"
                size="small"
                sx={{ ml: 2, width: 300 }}
                InputProps={{
                  ...params.InputProps,
                  // Remplacer le bouton "Rechercher" par une icône de loupe cliquable
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* Partie droite : Icônes et Connexion */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <IconButton color="inherit" component={Link} to="/panier">
            <ShoppingCartIcon />
          </IconButton>
          <IconButton color="inherit" component={Link} to="/wishlist">
            <FavoriteIcon />
          </IconButton>
          {token ? (
            <Tooltip title="Mon profil">
              <IconButton color="inherit" component={Link} to="/profile">
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Se connecter
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
