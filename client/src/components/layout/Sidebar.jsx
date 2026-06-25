import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Package,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Companies", icon: Building2 },
  { name: "Ledgers", icon: ClipboardList },
  { name: "Stock", icon: Package },
  { name: "Vouchers", icon: FileText },
  { name: "Reports", icon: BarChart3 },
  { name: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#1E2019] text-white p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-12 w-12 rounded-2xl bg-[#BE5A38] flex items-center justify-center font-bold text-xl">
          S
        </div>
        <div>
          <h1 className="text-2xl font-bold">SmartERP</h1>
          <p className="text-sm text-[#F5E3E0]">Billing • Inventory • Accounting</p>
        </div>
      </div>

      <p className="text-xs uppercase tracking-widest text-[#F5E3E0] mb-3">
        Main Menu
      </p>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
                item.active
                  ? "bg-[#BE5A38]"
                  : "hover:bg-[#A94E32]"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;