import { ProtectedRoute } from "@/components/auth/protected-route";
import "./globals.css";

export const metadata = {
  title: "Inkosei - Author Dashboard", 
  description: "Dashboard for authors to write and manage their novels.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark">
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </div>
  );
}
