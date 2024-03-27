/* eslint-disable max-len */
import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { log } from 'console';
import cloudinary from '../servieces/cloudinary.js';
import Product from '../model/product.js';
import User from '../model/user.js';
import Cart from '../model/cart.js';
import connect from '../database/connect.js';
import productHelper from '../helpers/productHelpers.js'

const adminproduct = async (req, res) => {
  try {
      const products = await productHelper.adminproductHelper();


      const userCart = await Cart.findOne({ userId: req.user._id });

      res.render('admin/product', { product: products, cartBadge: userCart });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};


// upload products
const uploadProducts = async (req, res) => {
  try {
    const { files } = req;
    await productHelper.uploadProductHelper(files, req);
    res.redirect('../admin/product');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding the product' });
  }
};

//   delete product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await productHelper.deleteProductHelper(productId);
    res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};

//   edit product
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const {
    productName,
    productCategory,
    productColor,
    productPrice,
    productBrand,
    productQuantity,
    productDescription,
    productConnectivity,
  } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let imageUrls = product.productImage;
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => cloudinary.uploader.upload(file.path));

      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map((result) => result.secure_url);
      imageUrls = newImageUrls;
    }


    // Update product details
    product.productImage = imageUrls;
    product.productName = productName;
    product.productCategory = productCategory;
    product.productColor = productColor;
    product.productPrice = productPrice;
    product.productBrand = productBrand;
    product.productQuantity = productQuantity;
    product.productDescription = productDescription;
    product.productConnectivity = productConnectivity;

    await product.save();
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

//   view product
const getProduct = async (req, res) => {
  try {
    const product = await productHelper.getProductHelper();
    res.render('../views/user/product', { product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching products' });
  }
};

//   cart
const getCart = async (req, res) => {
  try {
    const { user } = req;
    const cart = await productHelper.getCartHelper(user._id);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.products.forEach((product) => {
      product.productId.total = product.productId.productPrice * product.quantity;
    });

    const totalCartValue = cart.products.reduce((total, product) => total + product.productId.total, 0);

    res.render(path.join('../views/user/cart'), { cart, totalCartValue });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await productHelper.addToCartHelper(req.user._id, productId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

// DELETE  from the cart
const deleteCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await productHelper.deleteCartHelper(req.user._id, productId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting product from cart:', error);
    res.status(500).json({ error: 'Failed to delete product from cart' });
  }
};


const updateCart = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming userId is available in req.user
    const { productId, quantity } = req.params;
    const updatedCart = await productHelper.updateCartHelper(userId, productId, parseInt(quantity));

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
};


// checkout
const getCheckout = async (req, res) => {
  try {
    const { user } = req;
    // Fetch user's cart items
    const userData = await Cart.find({ userId: user._id });

    if (!userData.length) {
      return res.status(404).send('Cart is empty');
    }

    // Fetch product details for each item in the cart
    const populatedUserData = await Promise.all(userData.map(async (item) => {
      const products = await Promise.all(item.products.map(async (product) => {
        const productDetails = await Product.findById(product.productId);
        return {
          productId: product.productId,
          quantity: product.quantity,
          productPrice: productDetails.productPrice,
          productDetails,
        };
      }));
      return { ...item.toJSON(), products };
    }));

    // Calculate the grand total for all items in the cart
    let grandTotal = 0;
    populatedUserData.forEach((item) => {
      item.products.forEach((product) => {
        product.total = product.quantity * product.productPrice;
        grandTotal += product.productPrice * product.quantity;
      });
    });
    // Render the checkout view with cart items, product data, and user details
    res.render('../views/user/checkout', { cart: populatedUserData, user, grandTotal });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    await profileId.findOneAndDelete({ _id: profileId });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting profile');
  }
};

// payment
const placeOrder = async (req, res, next) => {
  try {
    const {
      userId, profileId, productId, cartId, payment_method, selectedAddress, jsonObject,
    } = req.body;
    const userData = await Cart.findOne({ userId: req.user._id });

    if (!userData) {
      return res.status(404).json({ error: 'User cart not found' });
    }

    // Extract products from user's cart
    const products = userData.products.map(async (product) => {
      const productData = await Product.findById(product.productId);
      return {
        productId: product.productId,
        quantity: product.quantity,
        price: productData.productPrice,
      };
    });

    // Resolve all product promises to get the product details
    const resolvedProducts = await Promise.all(products);

    // Calculate the total amount
    const amount = resolvedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);

    if (payment_method === 'cashondelivery') {
      // Handle cash on delivery payment method
      const newOrder = {
        profileId: req.user.address[selectedAddress]._id,
        products: resolvedProducts,
        paymentMethod: 'cash on delivery',
        amount,
      };

      req.user.orders.push(newOrder);
      await req.user.save();

      // Clear the cart after successful order and payment
      await Cart.findOneAndDelete({ userId: req.user._id });

      return res.status(200).json({ placeOrder: 'success' });
    } if (payment_method === 'razorpay') {
      // Process Razorpay
      const razorpayOptions = {
        key: 'rzp_test_ISlndBIl755xkB',
        amount: amount * 100,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Payment for Order',
        image: 'your_company_logo_url',
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '1234567890',
        },
      };
      console.log(razorpayOptions);
      return res.status(201).json({ razorpayOptions });
    }
    const newOrder = {
      profileId: req.user.address[jsonObject.selectedAddress]._id, // Assuming address has an _id field
      products: resolvedProducts,
      paymentMethod: 'razorpay',
      amount,

    };

    req.user.orders.push(newOrder); // Push the new order to the orders array

    await Cart.findOneAndDelete({ userId: req.user._id });
    await req.user.save();
    // Redirect to order summary page
    return res.status(200).json({ placeOrder: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const getOrderSummery = async (req, res) => {
  try {
    const { user } = req;
    // Fetch user's cart items
    const userData = user.orders;

    if (!userData.length) {
      return res.status(404).send('there is no orders');
    }

    // Fetch product details for each item in the cart using map
    const populatedUserData = await Promise.all(userData.map(async (item) => {
      const products = await Promise.all(item.products.map(async (product) => {
        const productDetails = await Product.findById(product.productId);
        return {
          productId: product.productId,
          quantity: product.quantity,
          productPrice: productDetails.productPrice,
          productDetails,
        };
      }));
      return { ...item.toJSON(), products };
    }));

    // Calculate the grand total for all items in the cart
    let grandTotal = 0;
    populatedUserData.forEach((item) => {
      item.products.forEach((product) => {
        product.total = product.quantity * product.productPrice;
        grandTotal += product.productPrice * product.quantity;
      });
    });


    // Render the checkout view with cart items, product data, and user details
    res.render('../views/user/orderSummary', { cart: populatedUserData, user, grandTotal });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default {
  getProduct,
  adminproduct,
  uploadProducts,
  deleteProduct,
  updateProduct,
  getCart,
  addToCart,
  deleteCart,
  getCheckout,
  deleteProfile,
  placeOrder,
  updateCart,
  getOrderSummery,
};
