const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");

// Create Stock Item
router.post("/", auth, async (req, res) => {
  try {
    const {
      company_id,
      item_name,
      sku,
      unit,
      purchase_price,
      selling_price,
      quantity,
      gst_percentage,
      description,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO stock_items
      (user_id, company_id, item_name, sku, unit,
      purchase_price, selling_price, quantity,
      gst_percentage, description)

      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        req.user.id,
        company_id,
        item_name,
        sku,
        unit,
        purchase_price,
        selling_price,
        quantity,
        gst_percentage,
        description,
      ]
    );

    res.status(201).json({
      message: "Stock item created successfully",
      item: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Get Stock Items
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM stock_items
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      count: result.rows.length,
      items: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Update Stock Item
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      company_id,
      item_name,
      sku,
      unit,
      purchase_price,
      selling_price,
      quantity,
      gst_percentage,
      description,
    } = req.body;

    const result = await pool.query(
      `UPDATE stock_items
       SET company_id=$1,
           item_name=$2,
           sku=$3,
           unit=$4,
           purchase_price=$5,
           selling_price=$6,
           quantity=$7,
           gst_percentage=$8,
           description=$9,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=$10
       AND user_id=$11
       RETURNING *`,
      [
        company_id,
        item_name,
        sku,
        unit,
        purchase_price,
        selling_price,
        quantity,
        gst_percentage,
        description,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Stock item not found",
      });
    }

    res.json({
      message: "Stock item updated successfully",
      item: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Delete Stock Item
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM stock_items
       WHERE id=$1
       AND user_id=$2
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Stock item not found",
      });
    }

    res.json({
      message: "Stock item deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;