const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      throw createError(400, 'User already exists');
    }

    // Create a new user
    user = new User({ name, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

    res.status(201).json({ token });
  } catch (err) {
    next(err); // Pass the error to the Express error handler
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      throw createError(400, 'Invalid Credentials');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createError(400, 'Invalid Credentials');
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

    res.json({ token });
  } catch (err) {
    next(err); // Pass the error to the Express error handler
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw createError(404, 'User not found');
    }
    res.json(user);
  } catch (err) {
    next(err); // Pass the error to the Express error handler
  }
};

module.exports = { signup, login, getUserProfile };
