const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

//Local
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     console.log('DB connection successful');
//   });

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful');
    // .catch((err) => console.log('Error'));
  });

//
//
//
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`running on port ${port}...`);
});
// process.on('uncaughtException', (err) => {
//   console.log('UNHANDLED EXCEPTION! Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
// process.on('unhandledRejection', (err) => {
//   console.log(err.name, err.message, err);
//   console.log('UNHANDLED REJECTION! Shutting down...');
//   server.close(() => {
//     process.exit(1);
//   });
// });
