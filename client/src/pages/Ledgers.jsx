import { useEffect, useState } from "react";
import API from "@/services/api";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

function Ledgers() {
  const [token, setToken] = useState("");
  const [ledgers, setLedgers] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    company_id: "",
    ledger_name: "",
    ledger_type: "Customer",
    ledger_group: "Sundry Debtors",
    opening_balance: 0,
    phone: "",
    email: "",
    address: "",
    gst_number: "",
    notes: "",
  });

  const fetchLedgers = async () => {
    const res = await API.get("/ledgers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLedgers(res.data.ledgers);
  };

  const createLedger = async () => {
    await API.post("/ledgers", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setForm({
      company_id: "",
      ledger_name: "",
      ledger_type: "Customer",
      ledger_group: "Sundry Debtors",
      opening_balance: 0,
      phone: "",
      email: "",
      address: "",
      gst_number: "",
      notes: "",
    });

    fetchLedgers();
  };

  const deleteLedger = async (id) => {
    await API.delete(`/ledgers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLedgers();
  };

  const filteredLedgers = ledgers.filter((ledger) =>
    ledger.ledger_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <section className="bg-white rounded-3xl p-8 shadow-md mb-6">
        <Badge className="bg-[#BE5A38] mb-4">Ledger Management</Badge>
        <h1 className="text-4xl font-bold text-[#1E2019]">
          Ledgers
        </h1>
        <p className="text-gray-500 mt-2">
          Manage customer, supplier, bank, cash, income and expense ledgers.
        </p>
      </section>

      <Card className="rounded-3xl shadow-md border-0 mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Authentication</h2>
          <Input
            placeholder="Paste JWT token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="rounded-2xl h-12"
          />
          <Button
            onClick={fetchLedgers}
            className="rounded-2xl bg-[#BE5A38] hover:bg-[#A94E32]"
          >
            Load Ledgers
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-md border-0 mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <Plus size={20} /> Add Ledger
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <Input placeholder="Company ID" value={form.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })} />
            <Input placeholder="Ledger Name" value={form.ledger_name} onChange={(e) => setForm({ ...form, ledger_name: e.target.value })} />
            <Input placeholder="Ledger Type" value={form.ledger_type} onChange={(e) => setForm({ ...form, ledger_type: e.target.value })} />
            <Input placeholder="Ledger Group" value={form.ledger_group} onChange={(e) => setForm({ ...form, ledger_group: e.target.value })} />
            <Input placeholder="Opening Balance" value={form.opening_balance} onChange={(e) => setForm({ ...form, opening_balance: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input placeholder="GST Number" value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} />
          </div>

          <Input
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="mt-4"
          />

          <Button
            onClick={createLedger}
            className="mt-5 rounded-2xl bg-[#BE5A38] hover:bg-[#A94E32]"
          >
            Create Ledger
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-md border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Ledger List</h2>
            <div className="relative w-80">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search ledger..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-3">Name</th>
                  <th>Type</th>
                  <th>Group</th>
                  <th>Opening Balance</th>
                  <th>Phone</th>
                  <th>GST</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLedgers.map((ledger) => (
                  <tr key={ledger.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 font-semibold">{ledger.ledger_name}</td>
                    <td>{ledger.ledger_type}</td>
                    <td>{ledger.ledger_group}</td>
                    <td>₹{ledger.opening_balance}</td>
                    <td>{ledger.phone}</td>
                    <td>{ledger.gst_number}</td>
                    <td className="flex gap-2 py-3">
                      <Button size="sm" variant="outline">
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteLedger(ledger.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLedgers.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No ledgers found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default Ledgers;