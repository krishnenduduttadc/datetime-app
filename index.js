const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const now = new Date();

  res.send(`
    <h1>Current Date & Time</h1>
    <p>${now.toLocaleString()}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
