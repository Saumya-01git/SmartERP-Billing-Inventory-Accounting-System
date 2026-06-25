import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 p-8">
        <Navbar />
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;