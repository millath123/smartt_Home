import bcrypt from 'bcrypt';
import Admin from '../model/admin.js';
import User from '../model/user.js';

const adminSighnupPageHelper = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const newAdmin = new Admin({
                email: adminEmail,
                password: hashedPassword,
            });
            await newAdmin.save();
            resolve({ admin: true });
        } catch (error) {
            reject(error);
        }
    });
};

const adminLoginHelper = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = body;
            const savedAdmin = await Admin.findOne({ email });
            if (savedAdmin) {
                const matchPass = await bcrypt.compare(password, savedAdmin.password);
                if (matchPass) {
                    resolve({ admin: true, savedAdmin });
                } else {
                    resolve({ passwordMismatch: true });
                }
            } else {
                resolve({ adminNotFound: true });
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};


const adminusersHelper = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await User.find();
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUserHelper = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);

    
        if (!user) {
            return 'error'
        }
       return user
    } catch (error) {
        console.error(error);
       return error
    }
    
  };

  

export default {
    adminSighnupPageHelper, 
    adminLoginHelper,
    adminusersHelper,
    deleteUserHelper
};
