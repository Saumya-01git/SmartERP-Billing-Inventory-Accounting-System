import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function RecentActivity() {
  const activities = [
    ["User logged in", "saumya@test.com", "Just now"],
    ["Dashboard opened", "Summary loaded", "Just now"],
    ["Company module tested", "CRUD verified", "Today"],
    ["PostgreSQL connected", "Backend active", "Today"],
  ];

  return (
    <Card className="rounded-3xl shadow-md border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <Badge variant="secondary">Live</Badge>
        </div>

        <div className="space-y-4">
          {activities.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-semibold">{item[0]}</p>
                <p className="text-sm text-gray-500">{item[1]}</p>
              </div>
              <span className="text-sm text-gray-400">{item[2]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;