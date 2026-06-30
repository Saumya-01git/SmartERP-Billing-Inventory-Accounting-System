require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const companyRoutes = require("./routes/companyRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const groupRoutes = require("./routes/groupRoutes");
const stockRoutes = require("./routes/stockRoutes");
const purchaseVoucherRoutes = require("./routes/purchaseVoucherRoutes");
const salesVoucherRoutes = require("./routes/salesVoucherRoutes");
const billingRoutes = require("./routes/billingRoutes");

const app = express();



app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/ledgers", ledgerRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/purchase-vouchers", purchaseVoucherRoutes);
app.use("/api/sales-vouchers", salesVoucherRoutes);
app.use("/api/billing", billingRoutes);

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