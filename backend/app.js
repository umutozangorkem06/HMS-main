const express = require("express");
const router = require("./routes/router.js");
const cors = require("cors");

const pool = require("./config/db");

const app = express();

// Use the routes defined in routes.js
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json()); // Add this line
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
