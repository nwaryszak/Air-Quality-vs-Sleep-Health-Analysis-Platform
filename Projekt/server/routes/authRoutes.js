const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'tajny_klucz'; 

// Rejestracja użytkownika
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body; // dodane firstName i lastName

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email już istnieje' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    // Tworzenie tokena z danymi użytkownika
    const token = jwt.sign(
      { userId: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: { id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Logowanie użytkownika
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Błędny email lub hasło' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Błędny email lub hasło' });

    const token = jwt.sign(
      { userId: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
