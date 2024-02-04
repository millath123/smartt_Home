import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
 
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

const userModel = mongoose.model("user", userSchema);

export default userModel;