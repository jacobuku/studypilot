import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <TopBar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
