
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, QrCode, BarChart2, Cog } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { title: "Validação de Cupons", path: "/", icon: QrCode },
    { title: "Dashboard", path: "/dashboard", icon: BarChart2 },
    { title: "Regras de Cupons", path: "/rules", icon: Cog },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with updated styling */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className={cn("p-4 flex items-center gap-3 justify-between", !sidebarOpen && "justify-center")}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <img src="/brouwer-logo.svg" alt="Brouwer Logo" className="h-8" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-700"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="text-gray-700"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
        <Separator />
        <div className="flex-1 py-6">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100",
                  !sidebarOpen && "justify-center px-0"
                )}
              >
                <item.icon className={cn("h-5 w-5", !sidebarOpen ? "mr-0" : "mr-3")} />
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4">
          <div className={cn(
            "p-3 bg-gray-50 rounded-lg",
            !sidebarOpen && "p-2"
          )}>
            {sidebarOpen ? (
              <div className="text-xs text-gray-600">
                <p className="font-medium">Brouwer Coupon Hub</p>
                <p>Versão 1.0.0</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <QrCode className="h-5 w-5 text-gray-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
