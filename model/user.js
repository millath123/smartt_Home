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
  Image: { type: String, 
  default: 'https://cdn4.vectorstock.com/i/1000x1000/35/53/person-icon-female-user-profile-avatar-vector-18833553.jpg' },
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
orders:[{
  
  profileId:{
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
            default: 1, // You can set a default quantity if needed
        },
    },
],
 
  paymentMethod:String,
  amount:String,
}]

});

const User = mongoose.model('user', userSchema);
export default User;
