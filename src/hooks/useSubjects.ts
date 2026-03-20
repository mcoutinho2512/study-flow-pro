import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type Subject = Tables<"subjects">;

const ALLOWED_COLORS = ["indigo", "emerald", "amber", "sky", "rose", "violet"] as const;
const MAX_SUBJECT_NAME_LENGTH = 50;

function validateSubjectName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome da matéria não pode estar vazio.");
  if (trimmed.length > MAX_SUBJECT_NAME_LENGTH) {
    throw new Error(`Nome não pode ter mais de ${MAX_SUBJECT_NAME_LENGTH} caracteres.`);
  }
  return trimmed;
}

function validateColor(color: string): string {
  if (!ALLOWED_COLORS.includes(color as typeof ALLOWED_COLORS[number])) {
    throw new Error("Cor inválida.");
  }
  return color;
}

export function useSubjects() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subjects", user?.id],
    queryFn: async (): Promise<Subject[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useCreateSubject() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      if (!user) throw new Error("Not authenticated");
      const validName = validateSubjectName(name);
      const validColor = validateColor(color);

      const { data, error } = await supabase
        .from("subjects")
        .insert({ user_id: user.id, name: validName, color: validColor })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, color }: { id: string; name?: string; color?: string }) => {
      const updates: Partial<{ name: string; color: string }> = {};
      if (name !== undefined) updates.name = validateSubjectName(name);
      if (color !== undefined) updates.color = validateColor(color);

      if (Object.keys(updates).length === 0) throw new Error("Nenhuma alteração informada.");

      const { data, error } = await supabase
        .from("subjects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("ID inválido.");
      const { error } = await supabase
        .from("subjects")
        .update({ is_archived: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
