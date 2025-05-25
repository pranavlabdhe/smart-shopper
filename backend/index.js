
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routers/authRouter');
const productRouter = require('./routers/productRouter');
const trackerRouter = require('./routers/trackerRouter');
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRouter);  // prefix all product routes with /api
app.use('/api/tracker', trackerRouter);
// MongoDB Connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.CONNECTION_STRING;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');   
  require('./cron/priceChecker');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
});
