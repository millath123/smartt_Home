import createError from 'http-errors';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import connect from './database/connect.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';

const app = express();
connect();

app.use((req, res, next) => { // cache clearing for all request and responses
  res.header(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
  );
  next();
});

app.set('view engine', 'hbs');

app.use(express.static(path.join('public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

// Set up user routes
app.use(userRoutes);

app.use((req, res, next) => {

  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
 console.log(err.message)
  res.status(err.status || 500);
  res.render('../views/user/404page');
});

const port = process.env.PORT || '8080';
app.listen(port, () => {
});
