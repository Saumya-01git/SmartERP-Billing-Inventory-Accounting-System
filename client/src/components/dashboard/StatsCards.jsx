import { Users, Package, Boxes, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function StatsCards({ summary }) {
  const cards = [
    {
      title: "Total Users",
      value: summary.totalUsers,
      icon: Users,
      color: "#587B7F",
    },
    {
      title: "Total Products",
      value: summary.totalProducts,
      icon: Package,
      color: "#8DAB7F",
    },
    {
      title: "Total Stock",
      value: summary.totalStock,
      icon: Boxes,
      color: "#BE5A38",
    },
    {
      title: "Inventory Value",
      value: `₹${summary.inventoryValue}`,
      icon: IndianRupee,
      color: "#9D6381",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="rounded-3xl shadow-md border-0 hover:-translate-y-1 transition">
            <CardContent className="p-6">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: card.color }}
              >
                <Icon size={24} />
              </div>
              <p className="text-gray-500 font-medium">{card.title}</p>
              <h2 className="text-3xl font-bold text-[#1E2019] mt-2">
                {card.value}
              </h2>
              <p className="text-sm text-[#587B7F] mt-2">Updated live</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default StatsCards;