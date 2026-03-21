import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, CalendarDays, Timer, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Início" },
  { path: "/subjects", icon: BookOpen, label: "Matérias" },
  { path: "/planner", icon: CalendarDays, label: "Planner" },
  { path: "/focus", icon: Timer, label: "Foco" },
  { path: "/analytics", icon: BarChart3, label: "Relatórios" },
  { path: "/settings", icon: Settings, label: "Config" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Status bar space - fundo escuro para ícones brancos ficarem visíveis */}
      <div
        className="bg-background fixed top-0 left-0 right-0 z-[60]"
        style={{ height: 'env(safe-area-inset-top)' }}
      />

      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))',
        }}
      >
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-default",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", isActive && "stroke-[2.5px]")} />
                <span className="text-[9px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      </nav>
    </div>
  );
}
