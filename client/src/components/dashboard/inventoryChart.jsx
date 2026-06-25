import { Card, CardContent } from "@/components/ui/card";

function InventoryChart() {
  return (
    <Card className="rounded-3xl shadow-md border-0">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-5">Inventory Overview</h3>

        <div className="h-64 rounded-2xl bg-[#FDECEF] flex items-end gap-5 p-6">
          {[40, 70, 50, 90, 65, 80].map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-2xl bg-[#9D6381]"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default InventoryChart;