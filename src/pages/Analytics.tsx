import { Clock, Flame, Target, BookOpen } from "lucide-react";
import StatCard from "@/components/StatCard";
import ProgressRing from "@/components/ProgressRing";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useWeeklyAnalytics, useGoalProgress, useStreak } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const { dailyHours, totalHours, sessionCount, subjectBreakdown, isLoading } = useWeeklyAnalytics();
  const goals = useGoalProgress();
  const { data: streak = 0 } = useStreak();

  if (isLoading) {
    return (
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto space-y-4">
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Relatórios</h1>
        <p className="text-muted-foreground mt-1">Seu desempenho nesta semana</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={Clock} label="Total de horas" value={`${totalHours}h`} />
        <StatCard icon={Flame} label="Sequência" value={`${streak} dias`} />
        <StatCard icon={Target} label="Meta diária" value={`${goals.daily.pct}%`} />
        <StatCard icon={BookOpen} label="Sessões" value={`${sessionCount}`} />
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card mb-6">
        <h2 className="font-semibold tracking-tight text-foreground mb-4">Horas por Dia</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dailyHours}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: 12,
              }}
              formatter={(val: number) => [`${val}h`, "Horas"]}
            />
            <Bar dataKey="hours" fill="hsl(243, 75%, 59%)" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {subjectBreakdown.length > 0 && (
        <div className="rounded-2xl bg-card p-5 shadow-card mb-6">
          <h2 className="font-semibold tracking-tight text-foreground mb-4">Por Matéria</h2>
          <div className="space-y-3">
            {subjectBreakdown.map((subject) => (
              <div key={subject.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.hslColor }} />
                <span className="flex-1 text-sm text-foreground">{subject.name}</span>
                <span className="text-sm tabular-nums text-muted-foreground">{subject.hours}h</span>
                <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${subject.pct}%`, backgroundColor: subject.hslColor }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-card p-5 shadow-card">
        <h2 className="font-semibold tracking-tight text-foreground mb-4">Metas</h2>
        <div className="flex justify-around">
          <ProgressRing
            progress={goals.weekly.pct}
            size={80}
            strokeWidth={6}
            label="Semanal"
            sublabel={`${goals.weekly.current.toFixed(0)}/${goals.weekly.target}h`}
          />
          <ProgressRing
            progress={goals.monthly.pct}
            size={80}
            strokeWidth={6}
            label="Mensal"
            sublabel={`${goals.monthly.current.toFixed(0)}/${goals.monthly.target}h`}
          />
          <ProgressRing
            progress={goals.daily.pct}
            size={80}
            strokeWidth={6}
            label="Diária"
            sublabel={`${goals.daily.current.toFixed(1).replace(".", ",")}/${goals.daily.target}h`}
          />
        </div>
      </div>
    </div>
  );
}
