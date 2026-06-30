const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");
const PDFDocument = require("pdfkit");

// Generate Invoice PDF
router.get("/invoice/:id", auth, async (req, res) => {
  try {

    const voucherResult = await pool.query(
      `SELECT
        sv.*,
        l.ledger_name,
        l.address,
        l.phone,
        l.gst_number
      FROM sales_vouchers sv
      JOIN ledgers l
      ON sv.customer_ledger_id = l.id
      WHERE sv.id=$1
      AND sv.user_id=$2`,
      [req.params.id, req.user.id]
    );

    if (voucherResult.rows.length === 0) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const itemsResult = await pool.query(
      `SELECT
        svi.*,
        si.item_name
      FROM sales_voucher_items svi
      JOIN stock_items si
      ON svi.stock_item_id = si.id
      WHERE svi.sales_voucher_id = $1`,
      [req.params.id]
    );

    const invoice = voucherResult.rows[0];

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-${invoice.voucher_number}.pdf`
    );

    doc.pipe(res);

    doc
  .fontSize(22)
  .text("SmartERP Invoice", {
    align: "center",
  });

    doc.moveDown(0.5);

    doc.moveTo(50, 90)
    .lineTo(550, 90)
    .stroke();

    doc.moveDown();

    doc.fontSize(12).text(
      `Invoice No : ${invoice.voucher_number}`
    );

    doc.text(
      `Date : ${new Date(invoice.voucher_date).toLocaleDateString()}`
    );

    doc.moveDown();

    doc.text(`Customer : ${invoice.ledger_name}`);
    doc.text(`Phone : ${invoice.phone}`);
    doc.text(`GST : ${invoice.gst_number}`);
    doc.text(`Address : ${invoice.address}`);

    doc.moveDown();

    doc.fontSize(14).text("Items");

doc.moveDown();

itemsResult.rows.forEach((item) => {
  doc
    .font("Helvetica-Bold")
    .text(item.item_name);

  doc
    .font("Helvetica")
    .text(`Quantity : ${item.quantity}`)
    .text(`Rate : Rs. ${item.rate}`)
    .text(`GST : ${item.gst_percentage}%`)
    .text(`Total : Rs. ${item.total}`);

  doc.moveDown();
});

doc.moveDown();

doc.moveTo(50, doc.y)
   .lineTo(550, doc.y)
   .stroke();

doc.moveDown();

doc.font("Helvetica")
   .fontSize(13)
   .text(`Subtotal : Rs. ${invoice.subtotal}`);

doc.text(`GST : Rs. ${invoice.gst_amount}`);

doc.font("Helvetica-Bold")
   .fontSize(16)
   .text(`Grand Total : Rs. ${invoice.grand_total}`);

doc.moveDown(2);

doc.font("Helvetica")
   .fontSize(11)
   .text("Thank you for your business!", {
      align: "center",
   });

    doc.end();

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

module.exports = router;