import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

function validateProfileUpdate(updates: TablesUpdate<"profiles">) {
  if (updates.daily_goal_hours !== undefined) {
    const v = Number(updates.daily_goal_hours);
    if (isNaN(v) || v < 0.5 || v > 24) throw new Error("Meta diária deve estar entre 0.5 e 24 horas.");
  }
  if (updates.weekly_goal_hours !== undefined) {
    const v = Number(updates.weekly_goal_hours);
    if (isNaN(v) || v < 1 || v > 168) throw new Error("Meta semanal deve estar entre 1 e 168 horas.");
  }
  if (updates.monthly_goal_hours !== undefined) {
    const v = Number(updates.monthly_goal_hours);
    if (isNaN(v) || v < 1 || v > 744) throw new Error("Meta mensal deve estar entre 1 e 744 horas.");
  }
  if (updates.focus_duration_minutes !== undefined) {
    const v = Number(updates.focus_duration_minutes);
    if (isNaN(v) || v < 5 || v > 120) throw new Error("Foco deve estar entre 5 e 120 minutos.");
  }
  if (updates.break_duration_minutes !== undefined) {
    const v = Number(updates.break_duration_minutes);
    if (isNaN(v) || v < 1 || v > 30) throw new Error("Intervalo deve estar entre 1 e 30 minutos.");
  }
  if (updates.full_name !== undefined && updates.full_name !== null) {
    if (typeof updates.full_name !== "string" || updates.full_name.length > 100) {
      throw new Error("Nome inválido (máximo 100 caracteres).");
    }
  }
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: TablesUpdate<"profiles">) => {
      if (!user) throw new Error("Not authenticated");
      validateProfileUpdate(updates);

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
