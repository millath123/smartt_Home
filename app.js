import express from 'express';
import connect from './database/connect.js';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import googleauthrouter from './helpers/googleauth.js';


// app.use(session({
//   secret: 'your-secret-key', // Replace with your own secret key
//   resave: false,
//   saveUninitialized: false
// }));




const app = express();

// Connect to the database
connect();

// Set the view engine to use Handlebars
app.set('view engine', 'hbs');

// Set the directory for static files
app.use(express.static(path.join( 'public')));
app.use(cookieParser());
// Parse incoming requests with JSON payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', userRoutes);

// Set up user routes
app.use(userRoutes);



const port = process.env.PORT || '8080';
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});