import express from 'express';
import connect from './database/connect.js';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';

import path from 'path';
import cookieParser from 'cookie-parser';



// app.use(session({
//   secret: 'your-secret-key', // Replace with your own secret key
//   resave: false,
//   saveUninitialized: false
// }));




const app = express();

// Connect to the database
connect();
app.use(function (req, res, next) { //cache clearing for all request and responses
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  )
  next()
  })

// Set the view engine to use Handlebars
app.set('view engine', 'hbs');

// Set the directory for static files
app.use(express.static(path.join( 'public')));
app.use(cookieParser());
// Parse incoming requests with JSON payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', userRoutes);
app.use('/admin', adminRoutes);


// Set up user routes
app.use(userRoutes);



const port = process.env.PORT || '8080';
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
