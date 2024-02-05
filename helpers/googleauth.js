import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import User from './model/user';
import dotenv from 'dotenv';
dotenv.config();



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLINT_ID,
    clientSecret: process.env.GOOGLE_CLINT_SECRET,
    callbackURL: process.env.callbackURL
    
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("this" + profile);
        const exituser = await User.findOne({ googleId: profile.id });
        console.log(exituser);
        if (exituser) {
            return done(null, exituser);
        }
        const name = profile.name.givenName;
        const newUser = new User({
            googleId: profile.id,
            name: name,
            email: profile.emails[0].value
        });
        const savedUser = await newUser.save();
        console.log(savedUser);
        
        done(null, savedUser);
    } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((User) => {
            if (!User) {
                
                return done(null, false); 
            }
            console.log(User);
            done(null, User);
        })
        .catch((error) => {
            // Handle any errors, including cast errors
            console.error('Error in deserialization:', error);
            done(error, false); 
        });
});

module.exports = passport;