const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usermodel',
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'productmodel',
            },
            quantity: {
                type: Number,
                default: 1, // You can set a default quantity if needed
            },
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
