import { Flame, Clock, Target, TrendingUp } from "lucide-react";
import StudyCard from "@/components/StudyCard";
import StatCard from "@/components/StatCard";
import ProgressRing from "@/components/ProgressRing";
import { useNavigate } from "react-router-dom";

const todaySessions = [
  { subject: "Advanced Mathematics", topic: "Linear Algebra", startTime: "14:00", endTime: "15:30", duration: "90m" },
  { subject: "Organic Chemistry", topic: "Reaction Mechanisms", startTime: "16:00", endTime: "17:00", duration: "60m" },
  { subject: "Constitutional Law", topic: "Amendments Review", startTime: "19:00", endTime: "20:30", duration: "90m" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Today</h1>
        <p className="text-muted-foreground mt-1">You have {todaySessions.length + 1} sessions planned.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={Flame} label="Day streak" value="12" trend="+2" trendUp />
        <StatCard icon={Clock} label="Hours today" value="3.5h" trend="+1.2h" trendUp />
      </div>

      {/* Weekly Progress */}
      <div className="rounded-2xl bg-card p-5 shadow-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold tracking-tight text-foreground">Weekly Goal</h2>
            <p className="text-xs text-muted-foreground mt-0.5">18 of 25 hours completed</p>
          </div>
          <ProgressRing progress={72} size={64} strokeWidth={6} />
        </div>
        <div className="flex gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div key={day + i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-2 rounded-full ${
                  i < 4 ? "bg-primary" : i === 4 ? "bg-primary/40" : "bg-secondary"
                }`}
              />
              <span className="text-[10px] text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Session */}
      <StudyCard
        subject="Organic Chemistry"
        topic="Stereochemistry Chapter 4"
        startTime="10:00"
        endTime="11:30"
        duration="90m"
        isNext
        onStart={() => navigate("/focus")}
      />

      {/* Schedule */}
      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Schedule
        </h2>
        {todaySessions.map((session, i) => (
          <StudyCard key={i} {...session} />
        ))}
      </div>
    </div>
  );
}
