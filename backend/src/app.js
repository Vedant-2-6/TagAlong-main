const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.MONGO_URI);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// app.use('/uploads/avatars', express.static(path.join(__dirname, '../../uploads/avatars'))); same as below
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));