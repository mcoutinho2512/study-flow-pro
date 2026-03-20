import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type SubjectNote = Tables<"subject_notes">;

export function useSubjectNotes(subjectId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subject_notes", subjectId],
    queryFn: async (): Promise<SubjectNote[]> => {
      if (!user || !subjectId) return [];
      const { data, error } = await supabase
        .from("subject_notes")
        .select("*")
        .eq("subject_id", subjectId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!subjectId,
  });
}

export function useCreateNote() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subjectId, title, content }: { subjectId: string; title: string; content: string }) => {
      if (!user) throw new Error("Não autenticado");
      const trimmedTitle = title.trim();
      if (!trimmedTitle) throw new Error("Título não pode estar vazio.");
      if (trimmedTitle.length > 100) throw new Error("Título muito longo (máx. 100 caracteres).");
      if (content.length > 5000) throw new Error("Conteúdo muito longo (máx. 5000 caracteres).");

      const { data, error } = await supabase
        .from("subject_notes")
        .insert({ user_id: user.id, subject_id: subjectId, title: trimmedTitle, content: content.trim() })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subject_notes", variables.subjectId] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, subjectId, title, content }: { id: string; subjectId: string; title?: string; content?: string }) => {
      const updates: Partial<{ title: string; content: string }> = {};
      if (title !== undefined) {
        const trimmed = title.trim();
        if (!trimmed) throw new Error("Título não pode estar vazio.");
        if (trimmed.length > 100) throw new Error("Título muito longo.");
        updates.title = trimmed;
      }
      if (content !== undefined) {
        if (content.length > 5000) throw new Error("Conteúdo muito longo.");
        updates.content = content.trim();
      }

      const { data, error } = await supabase
        .from("subject_notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subject_notes", variables.subjectId] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, subjectId }: { id: string; subjectId: string }) => {
      const { error } = await supabase
        .from("subject_notes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subject_notes", variables.subjectId] });
    },
  });
}
