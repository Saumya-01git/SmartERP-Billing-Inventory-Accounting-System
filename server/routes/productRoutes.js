const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add Product
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, price, quantity]
    );

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Get All Products
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json({
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;