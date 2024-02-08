import mongoose from "mongoose";

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
  googleId:String,
  name:String,
  Image:{type:String,default:"https://cdn4.vectorstock.com/i/1000x1000/35/53/person-icon-female-user-profile-avatar-vector-18833553.jpg"},
 googleId:String,

  address: [
    {
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
      landmark: {
        type: String,
      },
      pincode: {
        type: Number,
      },
    },
  ],
 
  
});

const User = mongoose.model("user", userSchema);

export default User;