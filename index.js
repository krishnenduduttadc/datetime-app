const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render
  },
});

// Home route (date & time)
app.get("/", (req, res) => {
  const now = new Date();
  res.send(`
    <h1>Current Date & Time</h1>
    <p>${now.toLocaleString()}</p>
    <p><a href="/api/users">View Users API</a></p>
  `);
});

// REST API: Get users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
