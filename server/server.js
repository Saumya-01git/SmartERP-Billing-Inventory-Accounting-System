require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();



app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("SmartERP Backend Running");
});

const PORT = process.env.PORT || 5000;

pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});