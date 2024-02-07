import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
    productImage: [String],
    productName: String,
    productDescription: String,
    productCategory: String,
    productBrand: String,
    productConnectivity: String,
    productColor: String,
    productPrice: String,
    productQuantity: String,
});
const Product = mongoose.model('Product', productSchema);
export default Product;