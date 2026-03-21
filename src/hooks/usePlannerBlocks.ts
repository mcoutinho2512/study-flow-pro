import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

export type PlannerBlock = Tables<"planner_blocks">;

export type PlannerBlockWithSubject = PlannerBlock & {
  subjects: { name: string; color: string } | null;
};

const ALLOWED_COLORS = ["indigo", "emerald", "amber", "sky", "rose", "violet"] as const;
const ALLOWED_SESSION_TYPES = ["estudo", "revisao", "exercicio", "leitura"] as const;
const ALLOWED_STATUSES = ["planned", "in_progress", "completed", "missed"] as const;

export type SessionType = typeof ALLOWED_SESSION_TYPES[number];
export type BlockStatus = typeof ALLOWED_STATUSES[number];

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  estudo: "Estudo",
  revisao: "Revisão",
  exercicio: "Exercício",
  leitura: "Leitura",
};

export const STATUS_LABELS: Record<BlockStatus, string> = {
  planned: "Planejado",
  in_progress: "Em andamento",
  completed: "Concluído",
  missed: "Perdido",
};

export const DAYS_OF_WEEK = [
  { value: 0, short: "Seg", full: "Segunda" },
  { value: 1, short: "Ter", full: "Terça" },
  { value: 2, short: "Qua", full: "Quarta" },
  { value: 3, short: "Qui", full: "Quinta" },
  { value: 4, short: "Sex", full: "Sexta" },
  { value: 5, short: "Sáb", full: "Sábado" },
  { value: 6, short: "Dom", full: "Domingo" },
] as const;

export const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00 - 22:00

function validateBlock(block: {
  title: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  color: string;
  session_type: string;
  notes?: string | null;
}) {
  const title = block.title.trim();
  if (!title || title.length > 100) throw new Error("Título deve ter entre 1 e 100 caracteres.");
  if (block.day_of_week < 0 || block.day_of_week > 6) throw new Error("Dia da semana inválido.");
  if (block.start_time >= block.end_time) throw new Error("Horário final deve ser depois do inicial.");
  if (!ALLOWED_COLORS.includes(block.color as typeof ALLOWED_COLORS[number])) throw new Error("Cor inválida.");
  if (!ALLOWED_SESSION_TYPES.includes(block.session_type as typeof ALLOWED_SESSION_TYPES[number])) throw new Error("Tipo de sessão inválido.");
  if (block.notes && block.notes.length > 1000) throw new Error("Observação deve ter no máximo 1000 caracteres.");

  const [startH, startM] = block.start_time.split(":").map(Number);
  const [endH, endM] = block.end_time.split(":").map(Number);
  const duration = (endH * 60 + endM) - (startH * 60 + startM);
  if (duration <= 0 || duration > 480) throw new Error("Duração deve ser entre 1 e 480 minutos.");

  return { ...block, title, duration_minutes: duration };
}

export function usePlannerBlocks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["planner_blocks", user?.id],
    queryFn: async (): Promise<PlannerBlockWithSubject[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("planner_blocks")
        .select("*, subjects(name, color)")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PlannerBlockWithSubject[];
    },
    enabled: !!user,
  });
}

export function useCreatePlannerBlock() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (block: {
      title: string;
      subject_id?: string | null;
      day_of_week: number;
      start_time: string;
      end_time: string;
      color: string;
      session_type: string;
      notes?: string | null;
    }) => {
      if (!user) throw new Error("Não autenticado.");
      const validated = validateBlock(block);

      const { data, error } = await supabase
        .from("planner_blocks")
        .insert({
          user_id: user.id,
          subject_id: block.subject_id || null,
          title: validated.title,
          day_of_week: validated.day_of_week,
          start_time: validated.start_time,
          end_time: validated.end_time,
          duration_minutes: validated.duration_minutes,
          color: validated.color,
          session_type: validated.session_type,
          notes: validated.notes || null,
        })
        .select("*, subjects(name, color)")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planner_blocks"] });
    },
  });
}

export function useUpdatePlannerBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      title?: string;
      subject_id?: string | null;
      day_of_week?: number;
      start_time?: string;
      end_time?: string;
      color?: string;
      session_type?: string;
      notes?: string | null;
      status?: string;
    }) => {
      const updateData: Record<string, unknown> = {};

      if (updates.title !== undefined) {
        const trimmed = updates.title.trim();
        if (!trimmed || trimmed.length > 100) throw new Error("Título inválido.");
        updateData.title = trimmed;
      }
      if (updates.subject_id !== undefined) updateData.subject_id = updates.subject_id || null;
      if (updates.day_of_week !== undefined) updateData.day_of_week = updates.day_of_week;
      if (updates.start_time !== undefined) updateData.start_time = updates.start_time;
      if (updates.end_time !== undefined) updateData.end_time = updates.end_time;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.session_type !== undefined) updateData.session_type = updates.session_type;
      if (updates.notes !== undefined) updateData.notes = updates.notes || null;
      if (updates.status !== undefined) {
        if (!ALLOWED_STATUSES.includes(updates.status as BlockStatus)) throw new Error("Status inválido.");
        updateData.status = updates.status;
      }

      // Recalculate duration if times changed
      if (updates.start_time && updates.end_time) {
        const [sH, sM] = updates.start_time.split(":").map(Number);
        const [eH, eM] = updates.end_time.split(":").map(Number);
        updateData.duration_minutes = (eH * 60 + eM) - (sH * 60 + sM);
      }

      const { data, error } = await supabase
        .from("planner_blocks")
        .update(updateData)
        .eq("id", id)
        .select("*, subjects(name, color)")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planner_blocks"] });
    },
  });
}

export function useDeletePlannerBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("ID inválido.");
      const { error } = await supabase
        .from("planner_blocks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planner_blocks"] });
    },
  });
}
