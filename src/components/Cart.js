import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  const productDataMap = {};

  productsData.forEach((product) => {
    productDataMap[product._id] = product;
  });

  const updatedData = cartData.map((cartItem) => ({
    ...productDataMap[cartItem.productId],
    ...cartItem,
  }));

  return updatedData;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  items.forEach((item) => {
    total += item.cost * item.qty;
  });

  return total;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ isReadOnly, productId, value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      {!isReadOnly ? (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleDelete(productId, value)}
          >
            <RemoveOutlined />
          </IconButton>
          <Box padding="0.5rem" data-testid="item-qty">
            {value}
          </Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleAdd(productId, value)}
          >
            <AddOutlined />
          </IconButton>{" "}
        </>
      ) : (
        <Box padding="0.5rem" data-testid="item-qty">
          Qty: {value}
        </Box>
      )}
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ isReadOnly, products, items = [], handleQuantity }) => {

  const [cartItemsDetails, setCartItemsDetails] = useState([]);
  const [orderDetails,setOrderDetails] = useState({});
  const history = useHistory();

  const handleAdd = useCallback(
    (productId, value) => {
      handleQuantity(productId, value + 1);
    },
    [handleQuantity]
  );

  const handleDelete = useCallback(
    (productId, value) => {
      handleQuantity(productId, value - 1);
    },
    [handleQuantity]
  );

  const handleCheckout = () => {
    history.push("/checkout");
  };

  const getTotalItems = useCallback((cartItems) => {
    let products = 0;
    cartItems.forEach((item) => {
      if (item.qty) {
        products += item.qty;
      }
    });

    const subTotal = getTotalCartValue(cartItems);
    const shippingCharges = 0;
    const total = subTotal + shippingCharges;

    setOrderDetails({
      products,
      subTotal,
      shippingCharges,
      total,
    });
  },[])

  useEffect(() => {
    setCartItemsDetails(generateCartItemsFrom(items, products));
    getTotalItems(generateCartItemsFrom(items, products));
  }, [getTotalItems, items, products]);



  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {cartItemsDetails.map((cartItem) => (
          <Box
            display="flex"
            alignItems="flex-start"
            padding="1rem"
            key={cartItem.productId}
          >
            <Box className="image-container">
              <img
                src={cartItem.image}
                alt={cartItem.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{cartItem.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  isReadOnly={isReadOnly}
                  productId={cartItem.productId}
                  value={cartItem.qty}
                  handleAdd={handleAdd}
                  handleDelete={handleDelete}
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${cartItem.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartItemsDetails)}
          </Box>
        </Box>

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && <Box className="orderDetails" sx={{padding:'1rem'}}>
        <Typography variant="h5">Order Details</Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>
            Products
          </Typography>
          <Typography>
            {orderDetails.products}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>
            Subtotal
          </Typography>
          <Typography>
            ${orderDetails.subTotal}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>
            Shipping Charges
          </Typography>
          <Typography>
            ${orderDetails.shippingCharges}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Total
          </Typography>
          <Typography>
            ${orderDetails.total}
          </Typography>
        </Box>
      </Box>}
    </>
  );
};

export default Cart;
