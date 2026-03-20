-- ============================================================
-- StudyFlow Pro - Tabela de Anotações por Matéria
-- Execute este SQL no Supabase SQL Editor DEPOIS do 002
-- ============================================================

-- Tabela de anotações vinculadas a matérias
CREATE TABLE public.subject_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Constraints
ALTER TABLE public.subject_notes
ADD CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
ADD CONSTRAINT content_length CHECK (char_length(content) <= 5000);

-- Indexes
CREATE INDEX idx_notes_subject ON public.subject_notes(subject_id);
CREATE INDEX idx_notes_user ON public.subject_notes(user_id);

-- RLS
ALTER TABLE public.subject_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON public.subject_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON public.subject_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON public.subject_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON public.subject_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE TRIGGER set_notes_updated_at
  BEFORE UPDATE ON public.subject_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
