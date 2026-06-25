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

// Get All Companies
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM companies
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      count: result.rows.length,
      companies: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Update Company
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      company_name,
      address,
      gst_number,
      financial_year,
      state,
      contact_number,
    } = req.body;

    const result = await pool.query(
      `UPDATE companies
       SET company_name=$1,
           address=$2,
           gst_number=$3,
           financial_year=$4,
           state=$5,
           contact_number=$6
       WHERE id=$7 AND user_id=$8
       RETURNING *`,
      [
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        contact_number,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json({
      message: "Company updated successfully",
      company: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Delete Company
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM companies
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;