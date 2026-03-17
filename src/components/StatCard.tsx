import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export default function StatCard({ icon: Icon, label, value, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl bg-card p-4 shadow-card transition-default hover:shadow-card-hover", className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">{value}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {trend && (
          <span className={cn("text-xs font-medium", trendUp ? "text-accent" : "text-destructive")}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
