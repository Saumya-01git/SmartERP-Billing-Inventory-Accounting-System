const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");

// Create Ledger
router.post("/", auth, async (req, res) => {
  try {
    const {
      company_id,
      ledger_name,
      ledger_type,
      ledger_group,
      opening_balance,
      phone,
      email,
      address,
      gst_number,
      notes,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO ledgers
      (user_id, company_id, ledger_name, ledger_type, ledger_group,
      opening_balance, phone, email, address, gst_number, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        req.user.id,
        company_id,
        ledger_name,
        ledger_type,
        ledger_group,
        opening_balance,
        phone,
        email,
        address,
        gst_number,
        notes,
      ]
    );

    res.status(201).json({
      message: "Ledger created successfully",
      ledger: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get All Ledgers
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM ledgers
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      count: result.rows.length,
      ledgers: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update Ledger
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      company_id,
      ledger_name,
      ledger_type,
      ledger_group,
      opening_balance,
      phone,
      email,
      address,
      gst_number,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE ledgers
       SET company_id=$1,
           ledger_name=$2,
           ledger_type=$3,
           ledger_group=$4,
           opening_balance=$5,
           phone=$6,
           email=$7,
           address=$8,
           gst_number=$9,
           notes=$10,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=$11 AND user_id=$12
       RETURNING *`,
      [
        company_id,
        ledger_name,
        ledger_type,
        ledger_group,
        opening_balance,
        phone,
        email,
        address,
        gst_number,
        notes,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    res.json({
      message: "Ledger updated successfully",
      ledger: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete Ledger
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM ledgers
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    res.json({
      message: "Ledger deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;