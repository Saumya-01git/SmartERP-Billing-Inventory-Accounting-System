import { Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

function Navbar() {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="relative w-[420px]">
        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
        <Input
          placeholder="Search companies, products, ledgers..."
          className="pl-12 h-12 rounded-2xl bg-white"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-sm">
          <Bell size={20} />
        </button>
        <button className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-sm">
          <Settings size={20} />
        </button>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-full bg-[#9D6381] text-white flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <p className="font-semibold leading-none">Saumya</p>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;