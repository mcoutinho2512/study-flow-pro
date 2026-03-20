import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export interface SessionWithSubject {
  id: string;
  user_id: string;
  subject_id: string;
  type: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  created_at: string;
  subjects: {
    name: string;
    color: string;
  } | null;
}

export function useStudySessions(from?: Date, to?: Date) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sessions", user?.id, from?.toISOString(), to?.toISOString()],
    queryFn: async (): Promise<SessionWithSubject[]> => {
      if (!user) return [];
      let query = supabase
        .from("study_sessions")
        .select("*, subjects(name, color)")
        .eq("user_id", user.id)
        .eq("type", "focus")
        .order("started_at", { ascending: false });

      if (from) query = query.gte("started_at", from.toISOString());
      if (to) query = query.lte("started_at", to.toISOString());

      const { data, error } = await query;
      if (error) throw error;
      return (data as SessionWithSubject[]) ?? [];
    },
    enabled: !!user,
  });
}

export function useTodaySessions() {
  const now = new Date();
  return useStudySessions(startOfDay(now), endOfDay(now));
}

export function useWeekSessions() {
  const now = new Date();
  return useStudySessions(startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 }));
}

export function useMonthSessions() {
  const now = new Date();
  return useStudySessions(startOfMonth(now), endOfMonth(now));
}

export function useCreateSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subject_id, type = "focus" }: { subject_id: string; type?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("study_sessions")
        .insert({
          user_id: user.id,
          subject_id,
          type,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ended_at, duration_seconds }: { id: string; ended_at: string; duration_seconds: number }) => {
      const { data, error } = await supabase
        .from("study_sessions")
        .update({ ended_at, duration_seconds })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("study_sessions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
