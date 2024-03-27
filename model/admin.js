import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  banners: {
    mainBanners: [
      {
        bannerImage: [String],
        bannerProduct: {
          type: String,
        },
        bannerAnnouncement: {
          type: String,
        },
        bannerDescription: {
          type: String,
        },
        bannerPrice: {
          type: Number,
        },
      },
    ],
    secondBanners: [
      {
        bannerImage: [String],
        bannerProduct: {
          type: String,
        },
        bannerAnnouncement: {
          type: String,
        },
        bannerDescription: {
          type: String,
        },
        bannerPrice: {
          type: Number,
        },
      },
    ],
    thirdBanners: [
      {
        bannerImage: [String],
        bannerProduct: {
          type: String,
        },
        bannerAnnouncement: {
          type: String,
        },
        bannerDescription: {
          type: String,
        },
        bannerPrice: {
          type: Number,
        },
      },
    ],
  },
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
