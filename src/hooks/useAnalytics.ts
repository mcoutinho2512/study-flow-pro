import { useMemo } from "react";
import { useWeekSessions, useMonthSessions, useTodaySessions, type SessionWithSubject } from "./useStudySessions";
import { useProfile } from "./useProfile";
import { format, startOfWeek, addDays, differenceInCalendarDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

function totalHours(sessions: SessionWithSubject[]): number {
  const totalSecs = sessions.reduce((acc, s) => acc + (s.duration_seconds ?? 0), 0);
  return Math.round((totalSecs / 3600) * 10) / 10;
}

const colorMap: Record<string, string> = {
  indigo: "hsl(243, 75%, 59%)",
  emerald: "hsl(142, 71%, 45%)",
  amber: "hsl(38, 92%, 50%)",
  sky: "hsl(199, 89%, 48%)",
  rose: "hsl(347, 77%, 50%)",
  violet: "hsl(263, 70%, 50%)",
};

export function useWeeklyAnalytics() {
  const { data: sessions = [], isLoading } = useWeekSessions();

  const analytics = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    const dailyHours = dayLabels.map((day, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const daySessions = sessions.filter((s) => s.started_at.startsWith(dateStr));
      return { day, hours: totalHours(daySessions) };
    });

    const subjectMap = new Map<string, { name: string; hours: number; color: string }>();
    for (const s of sessions) {
      const name = s.subjects?.name ?? "Sem matéria";
      const color = s.subjects?.color ?? "indigo";
      const existing = subjectMap.get(name) ?? { name, hours: 0, color };
      existing.hours += (s.duration_seconds ?? 0) / 3600;
      subjectMap.set(name, existing);
    }

    const total = totalHours(sessions);
    const subjectBreakdown = Array.from(subjectMap.values())
      .map((s) => ({
        ...s,
        hours: Math.round(s.hours * 10) / 10,
        pct: total > 0 ? Math.round((s.hours / (total || 1)) * 100) : 0,
        hslColor: colorMap[s.color] ?? colorMap.indigo,
      }))
      .sort((a, b) => b.hours - a.hours);

    return {
      dailyHours,
      totalHours: total,
      sessionCount: sessions.length,
      subjectBreakdown,
    };
  }, [sessions]);

  return { ...analytics, isLoading };
}

export function useGoalProgress() {
  const { data: profile } = useProfile();
  const { data: todaySessions = [] } = useTodaySessions();
  const { data: weekSessions = [] } = useWeekSessions();
  const { data: monthSessions = [] } = useMonthSessions();

  return useMemo(() => {
    const dailyTarget = profile?.daily_goal_hours ?? 4;
    const weeklyTarget = profile?.weekly_goal_hours ?? 25;
    const monthlyTarget = profile?.monthly_goal_hours ?? 120;

    const dailyCurrent = totalHours(todaySessions);
    const weeklyCurrent = totalHours(weekSessions);
    const monthlyCurrent = totalHours(monthSessions);

    return {
      daily: {
        current: dailyCurrent,
        target: dailyTarget,
        pct: Math.min(100, Math.round((dailyCurrent / dailyTarget) * 100)),
      },
      weekly: {
        current: weeklyCurrent,
        target: weeklyTarget,
        pct: Math.min(100, Math.round((weeklyCurrent / weeklyTarget) * 100)),
      },
      monthly: {
        current: monthlyCurrent,
        target: monthlyTarget,
        pct: Math.min(100, Math.round((monthlyCurrent / monthlyTarget) * 100)),
      },
    };
  }, [profile, todaySessions, weekSessions, monthSessions]);
}

export function useStreak() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async (): Promise<number> => {
      if (!user) return 0;

      const { data, error } = await supabase
        .from("study_sessions")
        .select("started_at")
        .eq("user_id", user.id)
        .eq("type", "focus")
        .order("started_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      if (!data?.length) return 0;

      const uniqueDays = new Set(
        data.map((s) => format(new Date(s.started_at), "yyyy-MM-dd"))
      );
      const sortedDays = Array.from(uniqueDays).sort().reverse();

      const today = format(new Date(), "yyyy-MM-dd");
      const yesterday = format(addDays(new Date(), -1), "yyyy-MM-dd");

      if (sortedDays[0] !== today && sortedDays[0] !== yesterday) return 0;

      let streak = 1;
      for (let i = 1; i < sortedDays.length; i++) {
        const diff = differenceInCalendarDays(
          new Date(sortedDays[i - 1]),
          new Date(sortedDays[i])
        );
        if (diff === 1) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    },
    enabled: !!user,
  });
}
