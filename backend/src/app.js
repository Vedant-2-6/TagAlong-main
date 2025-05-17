const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); // <-- This should be at the very top, before using process.env

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { /* options */ });

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');

// Serve avatar uploads statically
app.use('/uploads/avatars', express.static(path.join(__dirname, '../../uploads/avatars')));