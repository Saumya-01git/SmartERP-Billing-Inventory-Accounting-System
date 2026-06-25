const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Company
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      company_name,
      address,
      gst_number,
      financial_year,
      state,
      contact_number,
    } = req.body;

    // Check company limit (max 5 companies per user)
    const companyCount = await pool.query(
      "SELECT COUNT(*) FROM companies WHERE user_id = $1",
      [req.user.id]
    );

    if (Number(companyCount.rows[0].count) >= 5) {
      return res.status(400).json({
        message: "Maximum 5 companies allowed per user",
      });
    }

    const result = await pool.query(
      `INSERT INTO companies
      (user_id, company_name, address, gst_number, financial_year, state, contact_number)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        req.user.id,
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        contact_number,
      ]
    );

    res.status(201).json({
      message: "Company created successfully",
      company: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;