const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utilis/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1st Global Middleware
// Set Security HTTP headers
app.use(helmet());

//Development Login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 0 * 1000,
  message: 'Too many request, Try again in an hour',
});
app.use('/api', limiter);

//body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());
//Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//serving static files
app.use(express.static(`${__dirname}/public`));
// app.use(express.static(path.join(__dirname), 'public'));

// Test
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//Routes  Handlers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;