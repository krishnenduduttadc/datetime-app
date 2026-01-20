require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Helper: HTML layout
function renderPage(title, content) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        --primary: #2563eb;
        --bg: #f8fafc;
        --card: #ffffff;
        --text: #0f172a;
        --muted: #64748b;
      }

      * {
        box-sizing: border-box;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .card {
        background: var(--card);
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        width: 100%;
        max-width: 520px;
        text-align: center;
      }

      h1 {
        margin-top: 0;
        font-size: 1.8rem;
      }

      .time {
        font-size: 1.2rem;
        margin: 1rem 0;
        color: var(--primary);
        font-weight: 600;
      }

      .buttons {
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      a.button {
        text-decoration: none;
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        border: 1px solid var(--primary);
        color: white;
        background: var(--primary);
        font-weight: 500;
        transition: all 0.2s ease;
      }

      a.button.secondary {
        background: transparent;
        color: var(--primary);
      }

      a.button:hover {
        transform: translateY(-1px);
        opacity: 0.9;
      }

      footer {
        margin-top: 1.5rem;
        font-size: 0.85rem;
        color: var(--muted);
      }

      code {
        background: #eef2ff;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-size: 0.85rem;
      }
    </style>
  </head>
  <body>
    <div class="card">
      ${content}
      <footer>
        © ${new Date().getFullYear()} krishinfo.xyz · Powered by Node & PostgreSQL
      </footer>
    </div>
  </body>
  </html>
  `;
}

// Home page
app.get("/", (req, res) => {
  const now = new Date();

  const content = `
    <h1>Welcome to my page</h1>
    <p>Current server date & time</p>
    <div class="time">${now.toLocaleString()}</div>

    <div class="buttons">
      <a class="button" href="/api/users">View Users API</a>
      <a class="button secondary" href="/health">Health Check</a>
    </div>
  `;

  res.send(renderPage("KrishInfo | Date & Time", content));
});

// REST API: users
app.get("/api/users", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "OK", database: "connected" });
  } catch {
    res.status(500).json({ status: "ERROR", database: "disconnected" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
