const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard Summary
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    const productsResult = await pool.query("SELECT COUNT(*) FROM products");
    const stockResult = await pool.query(
      "SELECT COALESCE(SUM(quantity), 0) AS total_stock FROM products"
    );
    const valueResult = await pool.query(
      "SELECT COALESCE(SUM(price * quantity), 0) AS inventory_value FROM products"
    );

    res.json({
      message: "Dashboard summary fetched successfully",
      summary: {
        totalUsers: Number(usersResult.rows[0].count),
        totalProducts: Number(productsResult.rows[0].count),
        totalStock: Number(stockResult.rows[0].total_stock),
        inventoryValue: Number(valueResult.rows[0].inventory_value),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;