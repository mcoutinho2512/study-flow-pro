-- ============================================================
-- StudyFlow Pro - Planner Semanal de Estudos
-- Execute este SQL no Supabase SQL Editor DEPOIS do 003
-- ============================================================

-- Tabela de blocos do planner semanal
CREATE TABLE public.planner_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT 'indigo',
  session_type TEXT NOT NULL DEFAULT 'estudo',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Constraints
ALTER TABLE public.planner_blocks
ADD CONSTRAINT day_of_week_valid CHECK (day_of_week >= 0 AND day_of_week <= 6),
ADD CONSTRAINT duration_positive CHECK (duration_minutes > 0 AND duration_minutes <= 480),
ADD CONSTRAINT end_after_start CHECK (end_time > start_time),
ADD CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
ADD CONSTRAINT notes_length CHECK (notes IS NULL OR char_length(notes) <= 1000),
ADD CONSTRAINT color_valid CHECK (color IN ('indigo', 'emerald', 'amber', 'sky', 'rose', 'violet')),
ADD CONSTRAINT session_type_valid CHECK (session_type IN ('estudo', 'revisao', 'exercicio', 'leitura')),
ADD CONSTRAINT status_valid CHECK (status IN ('planned', 'in_progress', 'completed', 'missed'));

-- Indexes
CREATE INDEX idx_planner_user ON public.planner_blocks(user_id);
CREATE INDEX idx_planner_user_day ON public.planner_blocks(user_id, day_of_week);
CREATE INDEX idx_planner_subject ON public.planner_blocks(subject_id);

-- RLS
ALTER TABLE public.planner_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own planner blocks"
  ON public.planner_blocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own planner blocks"
  ON public.planner_blocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own planner blocks"
  ON public.planner_blocks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own planner blocks"
  ON public.planner_blocks FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE TRIGGER set_planner_blocks_updated_at
  BEFORE UPDATE ON public.planner_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
