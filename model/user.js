import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  token: String,
  googleId: String,
  name: String,
  Image: {
    type: String,
    default: 'https://cdn-icons-png.freepik.com/512/9187/9187604.png'
  },
  address: [
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      mobileNo: {
        type: String,
      },
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      userAddress: {
        type: String,
      },
      state: {
        type: String,
      },
      locality: {
        type: String,
      },
      pincode: {
        type: Number,
      },
      saveAddressAs: {
        type: String,
      }
    },
  ],

  wishlist: [{
    items: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products'
    }
  }],

  cart: [{
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'productmodel',
        },
        quantity: {
          type: Number,
          default: 1, 
        },
      },
    ],
  }],
  
  orders: [{
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'productmodel',
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    paymentMethod: String,
    amount: String,
    orderDate: {
      type: Date,
      default: Date.now,
    },
  }]

});

const User = mongoose.model('user', userSchema);
export default User;
