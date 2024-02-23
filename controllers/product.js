
import express from 'express';
import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../helpers/cloudinary.js';
import Product from '../model/product.js';
import User from '../model/user.js';
import Cart from '../model/cart.js';
import connect from '../database/connect.js';

const adminproduct = async function (req, res) {
  const product = await Product.find();
  res.render('admin/product', { product });
};
const uploadImages = async (req, res) => {
  try {
    const { files } = req;

    if (!files || files.length === 0) {
      return res.status(400).render(path.join(__dirname, '../views/admin/product'), { noimg: 'ok' });
    }

    const uploadPromises = files.map((file) => cloudinary.uploader.upload(file.path));

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map((result) => result.secure_url);

    const {
      productName,
      productDescription,
      productCategory,
      productBrand,
      productColor,
      productConnectivity,
      productPrice,
      productQuantity,
    } = req.body;

    const newProduct = new Product({
      productName,
      productDescription,
      productCategory,
      productBrand,
      productColor,
      productConnectivity,
      productPrice,
      productQuantity,
      productImage: imageUrls,
    });

    await newProduct.save();
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
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

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
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
};

//   view product
const getProduct = async (req, res, next) => {
  try {
    // Fetch all products
    const product = await Product.find();

    // Render the product view with the fetched products
    res.render(path.join('../views/user/product'), { product });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
};

//   cart
const getCart = async (req, res) => {
  try {
    const user = req.user;

    // Find the user's cart and populate both the product ID and product details
    const cart = await Cart.findOne({ userId: user._id }).populate({
      path: 'products.productId',
      model: 'Product' // Replace 'Product' with the name of your product model
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.render(path.join( '../views/user/cart'), { cart });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      // Check if the product is already in the cart
      const existingProduct = cart.products.find(item => item.productId.equals(productId));

      if (existingProduct) {
        // If the product is found, update its quantity
        existingProduct.quantity += 1;
      } else {
        // If the product is not found, add it to the cart
        cart.products.push({ productId, quantity: 1 });
      }
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ success: true, message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

// DELETE route for removing a product from the cart
const deleteCart = async (req, res) => {
  const productId = req.params.productId;

  try {
      const userToken = req.cookies.user_token;
      const user = req.user

      if (!user) {
          return res.status(401).json({ error: 'User not authenticated' });
      }

      const cart = await Cart.findOne({ userId: user._id });

      if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
      }

      await Cart.updateOne({ userId: user._id }, { $pull: { products: { productId } } });

      res.status(200).json({ message: 'Product deleted from cart successfully' });
  } catch (error) {
      console.error('Error deleting product from cart:', error);
      res.status(500).json({ error: 'Failed to delete product from cart' });
  }
};

// update cart
const updateCart =  async(req,res)=>{

}

//   checkout
const getCheckout = async (req, res) => {
  try {
    const user = req.user;
    // Fetch user's cart items and corresponding product data in a single query
    const userData = await Cart.aggregate([
      {
        $match: { userId: user._id }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'product'
        }
      }
    ]);

    if (!userData.length) {
      return res.status(404).send('Cart is empty');
    }
    
    userData.forEach((m) => {
      let a = m.products[0].quantity
      m.product.forEach((e) => {
        m.total = e.productPrice * a;
      })
    })
    // Calculate the grand total for all items in the cart
    const grandTotal = userData.reduce((acc, curr) => acc + curr.total, 0);
    // Render the checkout view with cart items, product data, and user details
    res.render('../views/user/checkout', { cart: userData, user, grandTotal });
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

//  payment
const placeOrder = async (req, res, next) => {
  try {
    const {
      userId, profileId, productId, cartId, paymentMethod,
    } = req.body;

    // console.log('Received data:', req.body);
    if (paymentMethod === 'cashOnDelivery') {

    }
    else if (paymentMethod === 'razorpay') {
      // Process Razorpay
      const { amount } = req.body; // Extract amount from the request body

      const razorpayOptions = {
        key: process.env.PAY_KEY, // Update with your actual environment variable
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
      return res.json({ razorpayOptions });
    }
    // else {
    // }

    const newOrder = new Order({
      userId,
      profileId,
      productId,
      cartId,
      paymentMethod,
    });

    await newOrder.save();

    res.status(200).send('Order placed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
export default {
  getProduct,
  adminproduct,
  uploadImages,
  deleteProduct,
  updateProduct,
  getCart,
  addToCart,
  deleteCart,
  getCheckout,
  deleteProfile,
  placeOrder,
};