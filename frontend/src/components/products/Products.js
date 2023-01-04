import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { Typography } from "@mui/material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import { config } from "../../App";
import Cart from "../cart/Cart";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import ProductCard from "../productCard/ProductCard";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [fetchProductsStatus, setFetchProductsStatus] = useState("idle");
  const [debounceTimer, setDebounceTimer] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const fetchCart = async () => {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${localStorage.token}`,
    };
    if (localStorage.token) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.endpoint}/cart`);

        setCartItems(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(
          error.response?.data?.message ||
            "Something went wrong. Failed to fetch cart items.",
          { variant: "error" }
        );
      }
    }
  };

  const performAPICall = async () => {
    setFetchProductsStatus("pending");
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      setFetchProductsStatus("fulfilled");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(
        error.response?.data?.message ||
          "Something went wrong. Failed to fetch products.",
        { variant: "error" }
      );
      setFetchProductsStatus("rejected");
    }
  };

  const performSearch = async (text) => {
    setFetchProductsStatus("pending");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data);
      setFetchProductsStatus("fulfilled");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response.status !== 404) {
        enqueueSnackbar(
          error.response?.data?.message ||
            "Something went wrong. Failed to fetch products.",
          { variant: "error" }
        );
        setFetchProductsStatus("rejected");
      } else {
        setProducts([]);

        setFetchProductsStatus("fulfilled");
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimer);
    let timer = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);

    setDebounceTimer(timer);
  };

  const isItemInCart = (productId) => {
    const itemInCart = cartItems.filter((item) => item.productId === productId);

    return !!itemInCart.length;
  };

  const addToCart = async (productId, qty) => {
    try {
      const response = await axios.post(`${config.endpoint}/cart`, {
        productId,
        qty,
      });

      setCartItems(response.data);
      if (qty === 1)
        enqueueSnackbar("product added to cart.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Something went wrong. Failed to fetch products.",
        { variant: "error" }
      );
    }
  };

  const handleAddToCart = async (productId, qty = 1) => {
    if (isItemInCart(productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }
    addToCart(productId, qty);
  };

  const handleQuantity = (productId, quantity) => {
    let cartItemsCopy = [...cartItems];

    if (quantity > 0) {
      cartItemsCopy = cartItemsCopy.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            qty: quantity >= 0 ? quantity : 0,
          };
        }

        return item;
      });
    } else {
      cartItemsCopy = cartItemsCopy.filter(
        (item) => item.productId !== productId
      );
    }

    addToCart(productId, quantity >= 0 ? quantity : 0);
    setCartItems(cartItemsCopy);
  };

  useEffect(() => {
    performAPICall();
    fetchCart();
  }, []);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("username"));
  }, []);

  return (
    <div>
      <Header>
        <TextField
          className="search search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="search"
          name="search"
          sx={{ width: "unset" }}
          onChange={(e) => debounceSearch(e, debounceTimer)}
        />
      </Header>

      <Grid container>
        <Grid item xs={12} md={isLoggedIn ? 9 : 12}>
          {/* Search view for mobiles */}
          <TextField
            className="search-mobile"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="search"
            name="search"
            onChange={(e) => debounceSearch(e, debounceTimer)}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>

          {isLoading && (
            <Grid item xs={12}>
              <Box className="loading">
                <CircularProgress />
                <Typography>Loading products</Typography>
              </Box>
            </Grid>
          )}

          {!isLoading && (
            <Grid container spacing={2} sx={{ p: 2 }}>
              {products.length > 0 ? (
                products.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={handleAddToCart}
                    />{" "}
                  </Grid>
                ))
              ) : (
                <Box
                  sx={{
                    height: "50vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SentimentDissatisfied />
                  <Typography>No products found</Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {isLoggedIn && (
          <Grid
            item
            xs={12}
            md={3}
            sx={{ backgroundColor: "primary.extraLight" }}
          >
            <Cart
              isReadOnly={false}
              products={products}
              items={cartItems}
              handleQuantity={handleQuantity}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
