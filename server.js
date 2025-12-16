// server.js
const express = require('express');
const sql = require('mysql');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5002;

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// =================== MySQL connection ===================
const db = sql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'register_db',
});

// =================== File upload ===================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// =================== JWT Middleware ===================
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ msg: "No token provided" });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// =================== Routes ===================

// Register User
app.post('/register', upload.single('image'), async (req, res) => {
  const { name, email, password } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !email || !password)
    return res.status(400).json({ msg: 'Please enter all fields' });

  // Check duplicate email
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ msg: 'Server error', error: err.message });
    if (results.length > 0) return res.status(400).json({ msg: 'Email already exists' });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, image],
        (err, result) => {
          if (err) return res.status(500).json({ msg: 'Server error', error: err.message });
          return res.status(201).json({ msg: 'User registered successfully' });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });
});

// Login User
app.post('/login', (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ msg: 'Server error', error: err.message });
    if (results.length === 0) return res.status(400).json({ msg: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ? `http://localhost:${port}/uploads/${user.image}` : null,
      },
    });
  });
});

// Protected Dashboard
app.get('/dashboard', verifyToken, (req, res) => {
  const userId = req.user.id;
  db.query('SELECT id, name, email, image FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ msg: 'Server error' });
    if (results.length === 0) return res.status(404).json({ msg: 'User not found' });

    const user = results[0];
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ? `http://localhost:${port}/uploads/${user.image}` : null,
      }
    });
  });
});

// Start Server
app.listen(port, () => console.log(`Server running on Port ${port}`));
