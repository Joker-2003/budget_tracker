const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://milliondollaet/?retryWrites=true&w=majority'; // Replace with your MongoDB URI

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose.connection;
