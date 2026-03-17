import { Clock, Flame, Target, TrendingUp, BookOpen } from "lucide-react";
import StatCard from "@/components/StatCard";
import ProgressRing from "@/components/ProgressRing";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const weeklyData = [
  { day: "Mon", hours: 4.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 5.0 },
  { day: "Thu", hours: 2.8 },
  { day: "Fri", hours: 4.0 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 3.0 },
];

const subjectBreakdown = [
  { name: "Mathematics", hours: 12, pct: 30, color: "hsl(243, 75%, 59%)" },
  { name: "Chemistry", hours: 9, pct: 22, color: "hsl(142, 71%, 45%)" },
  { name: "Law", hours: 8, pct: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Data Structures", hours: 7, pct: 18, color: "hsl(199, 89%, 48%)" },
  { name: "Biology", hours: 4, pct: 10, color: "hsl(347, 77%, 50%)" },
];

export default function Analytics() {
  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Your study performance this week</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={Clock} label="Total hours" value="24h" trend="+12%" trendUp />
        <StatCard icon={Flame} label="Streak" value="12 days" />
        <StatCard icon={Target} label="Completion" value="87%" trend="+5%" trendUp />
        <StatCard icon={BookOpen} label="Sessions" value="18" />
      </div>

      {/* Weekly Chart */}
      <div className="rounded-2xl bg-card p-5 shadow-card mb-6">
        <h2 className="font-semibold tracking-tight text-foreground mb-4">Hours by Day</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: 12,
              }}
              formatter={(val: number) => [`${val}h`, "Hours"]}
            />
            <Bar
              dataKey="hours"
              fill="hsl(243, 75%, 59%)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Breakdown */}
      <div className="rounded-2xl bg-card p-5 shadow-card mb-6">
        <h2 className="font-semibold tracking-tight text-foreground mb-4">Subject Breakdown</h2>
        <div className="space-y-3">
          {subjectBreakdown.map((subject) => (
            <div key={subject.name} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
              <span className="flex-1 text-sm text-foreground">{subject.name}</span>
              <span className="text-sm tabular-nums text-muted-foreground">{subject.hours}h</span>
              <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${subject.pct}%`, backgroundColor: subject.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="rounded-2xl bg-card p-5 shadow-card">
        <h2 className="font-semibold tracking-tight text-foreground mb-4">Goals</h2>
        <div className="flex justify-around">
          <ProgressRing progress={72} size={80} strokeWidth={6} label="Weekly" sublabel="18/25h" />
          <ProgressRing progress={45} size={80} strokeWidth={6} label="Monthly" sublabel="54/120h" />
          <ProgressRing progress={87} size={80} strokeWidth={6} label="Daily" sublabel="3.5/4h" />
        </div>
      </div>
    </div>
  );
}
