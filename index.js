require("dotenv").config();

const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Helper: HTML layout
function layout(title, body) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header>
    <div class="container">
      <h1>Krishnendu's Portfolio</h1>
      <nav>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#followers">Followers</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  ${body}

  <footer>
    © ${new Date().getFullYear()} krishinfo.xyz · Built with Node.js & PostgreSQL
  </footer>

  <script src="/script.js"></script>
</body>
</html>
`;
}

// Home / Portfolio page
app.get("/", async (req, res) => {
  let followers = [];

  try {
    const { rows } = await pool.query(
      "SELECT name, email FROM users ORDER BY id DESC"
    );
    followers = rows;
  } catch (err) {
    console.error(err);
  }

  const body = `
<section class="hero">
  <div class="container">
    <img src="/profile.png" alt="Profile Image" class="profile-img" />
    <h2>Hi, I'm Krishnendu 👋</h2>
    <p>Backend Developer Spring Boot · Node.js · PostgreSQL</p>
    <p>Building modern backend systems & APIs that scale</p>
    <a class="btn" href="#contact">Hire Me</a>
  </div>
</section>


<section id="about" class="section">
  <div class="container">
    <h3>About Me</h3>
    <p class="about-text">
      I am a results-driven software engineer with a primary focus on building enterprise-grade applications within the Java ecosystem, specifically specializing in Spring Boot. My technical versatility extends to the JavaScript landscape, where I leverage Node.js and Express.js to develop scalable and high-performance backend services. By grounding my development in a strong command of Data Structures and Algorithms (DSA) and a deep understanding of System Design, I architect modular, resilient systems that are optimized for both efficiency and high-traffic business requirements. I am proficient in managing relational data through PostgreSQL and ensuring seamless service communication via robust REST APIs. To ensure these solutions are production-ready, I bridge the gap between development and operations by utilizing Docker for containerization, Kubernetes for orchestration, and AWS or Render for reliable cloud hosting. Whether I am working on large-scale enterprise integrations or innovative projects, I am committed to delivering clean, maintainable code and exceptional user experiences.
    </p>
  </div>
</section>

<section id="skills" class="section alt">
  <div class="container">
    <h3>Skills</h3>
    <ul class="skills">
      <li>Spring Boot</li>
      <li>DSA in Java</li>
      <li>System Design</li>
      <li>Node.js</li>
      <li>Express.js</li>
      <li>PostgreSQL</li>
      <li>REST APIs</li>
      <li>Docker</li>
      <li>Kubernetes</li>
      <li>Machine Learning</li>
      <li>AWS / Cloud Services</li>
      <li>Render / Cloud Hosting</li>
    </ul>
  </div>
</section>

<section id="projects" class="section">
  <div class="container">
    <h3>Projects</h3>
    <div class="projects">
      <div class="card">
        <h4>Portfolio Website</h4>
        <p>Server-rendered portfolio with PostgreSQL integration.</p>
      </div>
      <div class="card">
        <h4>REST API Service</h4>
        <p>Secure API with authentication and database integration.</p>
      </div>
    </div>
  </div>
</section>

<section id="followers" class="section alt">
  <div class="container">
    <h3>Followers (${followers.length})</h3>
    <div class="followers">
      ${
        followers.length === 0
          ? "<p>No followers yet.</p>"
          : followers
              .map(
                (u) => `
                <div class="follower">
                  <strong>${u.name}</strong>
                  <span>${u.email}</span>
                </div>
              `
              )
              .join("")
      }
    </div>
  </div>
</section>

<section id="contact" class="section">
  <div class="container">
    <h3>Contact</h3>
    <p>Email: <a href="mailto:krishnenduduttadc@gmail.com">krish@example.com</a></p>
    <p>Website: https://krishinfo.xyz</p>
  </div>
</section>
`;

  res.send(layout("Krish | Portfolio", body));
});

// API (still available)
app.get("/api/users", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
