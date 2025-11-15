const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(__dirname + '/public'));

app.use(express.static('public'));

// ✅ Database connection
const db = mysql.createConnection({
  // host: 'localhost',
  // user: 'root',             // your MySQL username
  // password: 'Kanika_10',// the password you set during installation
  // database: 'petalverse_db' // your created DB
  host: 'trolley.proxy.rlwy.net',
  user: 'root',             // your MySQL username
  password: 'TtWlkWSdIbagpmFeUCjccXbVoyqoYNTP',// the password you set during installation
  database: 'petalverse_db' // your created DB
});

// Check connection
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL successfully!');
  }
});

// ✅ Basic test route
app.get('/', (req, res) => {
  res.send('PetalVerse backend is running 🌸');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//Authentication:

const bcrypt = require('bcryptjs');

// ==================== USER AUTH ROUTES ====================

// 📝 Signup
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) return res.status(400).json({ message: 'User already exists!' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Signup successful!' });
      }
    );
  });
});

// 🔐 Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found!' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Incorrect password!' });

    res.json({ message: 'Login successful!', user });
  });
});


// ==================== END OF USER AUTH ROUTES , wishlist ,product ====================

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



// ==================== CONTACT FORM ROUTE ====================

app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  const sql = 'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, phone, message], (err, result) => {
    if (err) {
      console.error('Error saving message:', err);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
    res.json({ message: 'Message sent successfully!' });
  });
});


// ==================== CART ROUTES ====================

// Get all cart items for a user
app.get('/cart/:email', (req, res) => {
  const { email } = req.params;
  const sql = `
    SELECT c.id, p.name, p.price, p.image, c.quantity
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_email = ?
  `;
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add item to cart
app.post('/cart', (req, res) => {
  const { email, product_id } = req.body;
  const sql = `
    INSERT INTO cart (user_email, product_id, quantity)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE quantity = quantity + 1
  `;
  db.query(sql, [email, product_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item added to cart!' });
  });
});

// Remove an item from cart
app.delete('/cart/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM cart WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item removed from cart!' });
  });
});

// Place order (clear cart)
app.post('/cart/place-order', (req, res) => {
  const { email } = req.body;
  db.query('DELETE FROM cart WHERE user_email = ?', [email], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order placed successfully!' });
  });
});

// ==================== WISHLIST ROUTES ====================

// ➕ Add to wishlist
app.post("/wishlist", (req, res) => {
  const { email, product_id } = req.body;
  if (!email || !product_id) return res.status(400).json({ message: "Missing data" });

  db.query("INSERT INTO wishlist (user_email, product_id) VALUES (?, ?)", [email, product_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product added to wishlist!" });
  });
});

// 🧾 Fetch wishlist items for a user
app.get("/wishlist/:email", (req, res) => {
  const email = req.params.email;
  db.query(
    "SELECT p.* FROM products p JOIN wishlist w ON p.id = w.product_id WHERE w.user_email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// ❌ Remove from wishlist
app.delete("/wishlist/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM wishlist WHERE product_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item removed from wishlist!" });
  });
});
