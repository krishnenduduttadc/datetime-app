require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // REQUIRED for Render external DB
  },
});

// Root route (date & time)
app.get("/", (req, res) => {
  const now = new Date();

  res.send(`
    <h1>Current Date & Time</h1>
    <p>${now.toLocaleString()}</p>
    <p><a href="/api/users">View Users API</a></p>
  `);
});

// REST API: fetch users
app.get("/api/users", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Health check (optional but useful)
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "OK", db: "connected" });
  } catch {
    res.status(500).json({ status: "ERROR", db: "not connected" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
