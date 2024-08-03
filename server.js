const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const createError = require('http-errors');
dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, 
)
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use('/api/auth', require('./routes/auth_route'));

app.use((req, res, next) => {
  next(createError(404, 'Not Found'));
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const shutdown = (signal) => {
  console.log(`Received ${signal}\n. Closing HTTP server...`)
  server.close(() => {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  });
};

process.on('SIGINT', () => {
  shutdown('SIGINT')
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM')
});