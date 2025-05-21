const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.MONGO_URI);
app.use(cors({
    origin: 'http://localhost:5173', // or use '*' for all origins (not recommended for production)
    credentials: true // if you need to send cookies or auth headers
}));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/trip', tripRoutes);
// Serve static files from the uploads directory
app.use('/uploads/avatars', express.static(path.join(__dirname, '../../uploads/avatars')));