import mongoose from 'mongoose'
const adminSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
    },
    {
    bannerImage: String,
    bannerProduct: String,
    bannerAnnouncement: String,
    bannerDescription: String,
    bannerPrice: String,
},
);

const Admin = mongoose.model('Admin',adminSchema);
export default Admin;