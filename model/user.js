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
  Image:{type:String,default:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1628563694622-5a76957fd09c%3Fq%3D80%26w%3D1000%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5zdGFncmFtJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%253D%253D&tbnid=PdUaviEqmGmfKM&vet=12ahUKEwiY1Yfu65SEAxXblGMGHZxsAYkQMygQegUIARCWAQ..i&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Finstagram-profile&docid=PZA6oaTli5spTM&w=1000&h=1499&q=profile%20pictures&ved=2ahUKEwiY1Yfu65SEAxXblGMGHZxsAYkQMygQegUIARCWAQ"},
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