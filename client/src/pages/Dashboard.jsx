import { useState } from "react";
import API from "@/services/api";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import InventoryChart from "@/components/dashboard/InventoryChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Dashboard() {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalStock: 0,
    inventoryValue: 0,
  });
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const res = await API.get("/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data.summary);
      setError("");
    } catch {
      setError("Invalid token or backend server is not running.");
    }
  };

  return (
    <DashboardLayout>
      <section className="bg-white rounded-3xl p-8 shadow-md mb-6">
        <Badge className="bg-[#BE5A38] mb-4">Business Overview</Badge>
        <h1 className="text-4xl font-bold text-[#1E2019]">
          Welcome back, Saumya 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your accounting, inventory and billing from one place.
        </p>
      </section>

      <section className="flex gap-4 mb-6">
        <Input
          placeholder="Paste JWT token here"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="h-12 rounded-2xl bg-white"
        />
        <Button
          onClick={loadDashboard}
          className="h-12 rounded-2xl bg-[#BE5A38] hover:bg-[#A94E32]"
        >
          Load Dashboard
        </Button>
      </section>

      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      <StatsCards summary={summary} />

      <section className="grid grid-cols-2 gap-6 mt-6">
        <InventoryChart />
        <RecentActivity />
      </section>

      <QuickActions />
    </DashboardLayout>
  );
}

export default Dashboard;