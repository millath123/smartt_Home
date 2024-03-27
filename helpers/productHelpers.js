import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { log } from 'console';
import cloudinary from '../servieces/cloudinary.js';
import Product from '../model/product.js';
import User from '../model/user.js';
import Cart from '../model/cart.js';
import connect from '../database/connect.js';

const adminproductHelper = async () => {
  try {
    const products = await Product.find(); 
    return products;
} catch (error) {
    throw new Error('Error fetching admin products');
}
  };

  
const uploadProductHelper = async (files, req) => {
    try {
      if (!files || files.length === 0) {
        console.log('errrrrr')
        throw new Error('No images uploaded');
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
    } catch (error) {
      console.log(error)
      throw error;
    }
  };


  const deleteProductHelper = async (productId) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        throw new Error('Product not found');
      }
  
      return deletedProduct;
    } catch (error) {
      throw error;
    }
  };
  
  
  const getProductHelper = async () => {
    try {
      // Fetch all products
      const products = await Product.find();
      return products;
    } catch (error) {
      console.log(error)
      throw new Error('Error fetching products');
    }
  };
  
  const getCartHelper = async (userId) => {
    try {
      const cart = await Cart.findOne({ userId }).populate({
        path: 'products.productId',
        model: 'Product', // Replace 'Product' with the name of your product model
      });
  
      return cart;
    } catch (error) {
      throw new Error('Error fetching cart');
    }
  };


  const addToCartHelper = async (userId, productId) => {
    try {
      
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({
          userId,
          products: [{ productId, quantity: 1 }],
        });
      } else {
        const existingProduct = cart.products.find((item) => item.productId.equals(productId));
  
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.products.push({ productId, quantity: 1 });
        }
      }
  
      await cart.save();
  
      return { success: true, message: 'Product added to cart' };
    } catch (error) {
      throw new Error('Failed to add product to cart');
    }
  };
  const deleteCartHelper = async (userId, productId) => {
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      await Cart.updateOne({ userId }, { $pull: { products: { productId } } });
  
      return { success: true, message: 'Product deleted from cart successfully' };
    } catch (error) {
      throw new Error('Failed to delete product from cart');
    }
  };


  const updateCartHelper = async (userId, productId, quantity) => {
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      const existingProduct = cart.products.find((product) => product.productId.toString() === productId);
  
      if (existingProduct) {
        existingProduct.quantity = quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
  
      await cart.save();
  
      return { success: true, message: 'Cart updated successfully' };
    } catch (error) {
      throw new Error('Failed to update cart');
    }
  };


  
export default{
    adminproductHelper,
    uploadProductHelper,
    deleteProductHelper,
    getProductHelper,
    getCartHelper,
    addToCartHelper,
    deleteCartHelper,
    updateCartHelper
}