import { Flame, Clock, BookOpen, Plus } from "lucide-react";
import StudyCard from "@/components/StudyCard";
import StatCard from "@/components/StatCard";
import ProgressRing from "@/components/ProgressRing";
import { useNavigate } from "react-router-dom";
import { useTodaySessions } from "@/hooks/useStudySessions";
import { useGoalProgress, useStreak } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: todaySessions = [], isLoading: loadingSessions } = useTodaySessions();
  const goals = useGoalProgress();
  const { data: streak = 0 } = useStreak();

  const todayHours = todaySessions.reduce((acc, s) => acc + (s.duration_seconds ?? 0), 0) / 3600;
  const todayHoursFormatted = todayHours.toFixed(1).replace(".", ",") + "h";

  const weekDays = ["S", "T", "Q", "Q", "S", "S", "D"];

  if (loadingSessions) {
    return (
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto space-y-4">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Hoje</h1>
        <p className="text-muted-foreground mt-1">
          {todaySessions.length > 0
            ? `Você completou ${todaySessions.length} ${todaySessions.length === 1 ? "sessão" : "sessões"} hoje.`
            : "Nenhuma sessão ainda. Comece a estudar!"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={Flame} label="Dias seguidos" value={`${streak}`} />
        <StatCard icon={Clock} label="Horas hoje" value={todayHoursFormatted} />
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold tracking-tight text-foreground">Meta Semanal</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {goals.weekly.current.toFixed(0)} de {goals.weekly.target} horas concluídas
            </p>
          </div>
          <ProgressRing progress={goals.weekly.pct} size={64} strokeWidth={6} />
        </div>
        <div className="flex gap-1">
          {weekDays.map((day, i) => (
            <div key={day + i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-2 rounded-full ${
                  goals.weekly.pct > 0 && i < Math.ceil((goals.weekly.pct / 100) * 7)
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              />
              <span className="text-[10px] text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {todaySessions.length === 0 ? (
        <div className="rounded-2xl bg-card p-6 shadow-card text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">Comece sua primeira sessão de estudo!</p>
          <Button onClick={() => navigate("/focus")} variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            Iniciar Foco
          </Button>
        </div>
      ) : (
        <div className="mt-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Sessões de Hoje
          </h2>
          {todaySessions.map((session) => (
            <StudyCard
              key={session.id}
              subject={session.subjects?.name ?? "Matéria"}
              startTime={format(new Date(session.started_at), "HH:mm")}
              endTime={session.ended_at ? format(new Date(session.ended_at), "HH:mm") : "--:--"}
              duration={session.duration_seconds ? `${Math.round(session.duration_seconds / 60)}m` : "--"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
