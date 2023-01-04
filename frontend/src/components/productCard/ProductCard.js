import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const { name, image, rating, cost, _id: id } = product;

  return (
    <Card className="card" key={id}>
      <CardMedia component="img" height="200" image={image} alt={name} />

      <CardContent>
        <Typography gutterBottom component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`$${cost}`}
        </Typography>
        <Rating name="rating" value={rating} readOnly />
      </CardContent>

      <CardActions>
        <Button
          role="button"
          name="add to cart"
          variant="contained"
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          size="small"
          startIcon={<AddShoppingCartOutlined />}
          onClick={() => handleAddToCart(id)}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
