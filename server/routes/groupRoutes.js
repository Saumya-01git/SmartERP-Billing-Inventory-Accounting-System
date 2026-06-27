const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");

// Create Group
router.post("/", auth, async (req, res) => {
  try {
    const { company_id, group_name, group_type, parent_group, description } = req.body;

    const result = await pool.query(
      `INSERT INTO groups
       (user_id, company_id, group_name, group_type, parent_group, description)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [req.user.id, company_id, group_name, group_type, parent_group, description]
    );

    res.status(201).json({
      message: "Group created successfully",
      group: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Groups
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM groups
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      count: result.rows.length,
      groups: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update Group
router.put("/:id", auth, async (req, res) => {
  try {
    const { company_id, group_name, group_type, parent_group, description } = req.body;

    const result = await pool.query(
      `UPDATE groups
       SET company_id=$1,
           group_name=$2,
           group_type=$3,
           parent_group=$4,
           description=$5,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=$6 AND user_id=$7
       RETURNING *`,
      [company_id, group_name, group_type, parent_group, description, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({
      message: "Group updated successfully",
      group: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete Group
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM groups
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;