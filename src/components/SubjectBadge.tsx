import { cn } from "@/lib/utils";

interface SubjectBadgeProps {
  name: string;
  color: string;
  sessions?: number;
  hours?: string;
  onClick?: () => void;
  className?: string;
}

const colorMap: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
  sky: "bg-sky-100 text-sky-700 border-sky-200",
  violet: "bg-violet-100 text-violet-700 border-violet-200",
  slate: "bg-secondary text-secondary-foreground border-border",
};

export default function SubjectBadge({ name, color, sessions, hours, onClick, className }: SubjectBadgeProps) {
  const colorClasses = colorMap[color] || colorMap.slate;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition-default hover:shadow-card-hover w-full",
        colorClasses,
        className
      )}
    >
      <h3 className="font-semibold tracking-tight">{name}</h3>
      {(sessions !== undefined || hours) && (
        <div className="flex items-center gap-3 mt-2 text-xs opacity-75">
          {sessions !== undefined && <span>{sessions} sessions</span>}
          {hours && <span>{hours}h studied</span>}
        </div>
      )}
    </button>
  );
}
