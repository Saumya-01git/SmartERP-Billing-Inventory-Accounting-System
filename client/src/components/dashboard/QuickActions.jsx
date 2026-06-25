import { Building2, Package, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

function QuickActions() {
  const actions = [
    { name: "Add Company", icon: Building2 },
    { name: "Add Product", icon: Package },
    { name: "Create Voucher", icon: FileText },
    { name: "View Reports", icon: BarChart3 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md mt-6">
      <h3 className="text-xl font-bold mb-5">Quick Actions</h3>

      <div className="grid grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.name}
              className="h-16 rounded-2xl bg-[#BE5A38] hover:bg-[#A94E32] text-white gap-2"
            >
              <Icon size={20} />
              {action.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;