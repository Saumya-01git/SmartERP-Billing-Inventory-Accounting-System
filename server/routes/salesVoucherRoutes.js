const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");

// Create Sales Voucher
router.post("/", auth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      company_id,
      customer_ledger_id,
      voucher_date,
      narration,
      items,
    } = req.body;

    // Generate Voucher Number
    const lastVoucher = await client.query(
  `SELECT id
   FROM sales_vouchers
   ORDER BY id DESC
   LIMIT 1`
);

const nextNumber =
  lastVoucher.rows.length > 0
    ? lastVoucher.rows[0].id + 1
    : 1;

const voucherNumber =
  "SAL-" + String(nextNumber).padStart(6, "0");

    let subtotal = 0;
    let gstAmount = 0;

    for (const item of items) {
      subtotal += item.quantity * item.rate;
      gstAmount +=
        (item.quantity * item.rate * item.gst_percentage) / 100;
    }

    const grandTotal = subtotal + gstAmount;

    const voucherResult = await client.query(
      `INSERT INTO sales_vouchers
      (
        user_id,
        company_id,
        customer_ledger_id,
        voucher_number,
        voucher_date,
        subtotal,
        gst_amount,
        grand_total,
        narration
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        req.user.id,
        company_id,
        customer_ledger_id,
        voucherNumber,
        voucher_date,
        subtotal,
        gstAmount,
        grandTotal,
        narration,
      ]
    );

    const voucherId = voucherResult.rows[0].id;

    for (const item of items) {

      const total =
        item.quantity * item.rate +
        (item.quantity * item.rate * item.gst_percentage) / 100;

      await client.query(
        `INSERT INTO sales_voucher_items
        (
          sales_voucher_id,
          stock_item_id,
          quantity,
          rate,
          gst_percentage,
          total
        )
        VALUES($1,$2,$3,$4,$5,$6)`,
        [
          voucherId,
          item.stock_item_id,
          item.quantity,
          item.rate,
          item.gst_percentage,
          total,
        ]
      );

      // Decrease Stock
      await client.query(
        `UPDATE stock_items
         SET quantity = quantity - $1
         WHERE id = $2`,
        [item.quantity, item.stock_item_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Sales Voucher Created Successfully",
      voucher: voucherResult.rows[0],
    });

  } catch (err) {

    await client.query("ROLLBACK");

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  } finally {

    client.release();

  }
});

// Get All Sales Vouchers
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          sv.*,
          l.ledger_name AS customer_name
       FROM sales_vouchers sv
       JOIN ledgers l
         ON sv.customer_ledger_id = l.id
       WHERE sv.user_id = $1
       ORDER BY sv.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Get Single Sales Voucher
router.get("/:id", auth, async (req, res) => {
  try {
    const voucherResult = await pool.query(
      `SELECT * FROM sales_vouchers
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (voucherResult.rows.length === 0) {
      return res.status(404).json({
        message: "Sales Voucher not found",
      });
    }

    const itemsResult = await pool.query(
      `SELECT *
       FROM sales_voucher_items
       WHERE sales_voucher_id = $1`,
      [req.params.id]
    );

    res.json({
      voucher: voucherResult.rows[0],
      items: itemsResult.rows,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Update Sales Voucher
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      voucher_date,
      narration,
    } = req.body;

    const result = await pool.query(
      `UPDATE sales_vouchers
       SET voucher_date = $1,
           narration = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       AND user_id = $4
       RETURNING *`,
      [
        voucher_date,
        narration,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Sales Voucher not found",
      });
    }

    res.json({
      message: "Sales Voucher updated successfully",
      voucher: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Delete Sales Voucher
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM sales_vouchers
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Sales Voucher not found",
      });
    }

    res.json({
      message: "Sales Voucher deleted successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;