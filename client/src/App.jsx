import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalStock: 0,
    inventoryValue: 0,
  });

  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummary(res.data.summary);
      setError("");
    } catch (err) {
      setError("Failed to fetch dashboard data. Please check token or backend.");
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>SmartERP</h2>
        <p>Billing • Inventory • Accounting</p>

        <nav>
          <a>Dashboard</a>
          <a>Companies</a>
          <a>Ledgers</a>
          <a>Stock</a>
          <a>Vouchers</a>
          <a>Reports</a>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your SmartERP business overview</p>
          </div>
        </header>

        <section className="token-box">
          <input
            type="text"
            placeholder="Paste JWT token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={fetchDashboard}>Load Dashboard</button>
        </section>

        {error && <p className="error">{error}</p>}

        <section className="cards">
          <div className="card">
            <p>Total Users</p>
            <h2>{summary.totalUsers}</h2>
          </div>

          <div className="card">
            <p>Total Products</p>
            <h2>{summary.totalProducts}</h2>
          </div>

          <div className="card">
            <p>Total Stock</p>
            <h2>{summary.totalStock}</h2>
          </div>

          <div className="card">
            <p>Inventory Value</p>
            <h2>₹{summary.inventoryValue}</h2>
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div>
            <button>Add Company</button>
            <button>Add Product</button>
            <button>Create Voucher</button>
            <button>View Reports</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;