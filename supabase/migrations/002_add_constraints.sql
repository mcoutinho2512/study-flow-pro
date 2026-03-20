-- ============================================================
-- StudyFlow Pro - Constraints Adicionais de Segurança
-- Execute este SQL no Supabase SQL Editor DEPOIS do 001
-- ============================================================

-- Validação de cores permitidas
ALTER TABLE public.subjects
ADD CONSTRAINT color_valid CHECK (color IN ('indigo', 'emerald', 'amber', 'sky', 'rose', 'violet'));

-- Validação de duração não-negativa
ALTER TABLE public.study_sessions
ADD CONSTRAINT duration_non_negative CHECK (duration_seconds IS NULL OR duration_seconds >= 0);

-- Validação de end >= start
ALTER TABLE public.study_sessions
ADD CONSTRAINT end_after_start CHECK (ended_at IS NULL OR ended_at >= started_at);

-- Validação de metas do perfil
ALTER TABLE public.profiles
ADD CONSTRAINT daily_goal_range CHECK (daily_goal_hours >= 0.5 AND daily_goal_hours <= 24),
ADD CONSTRAINT weekly_goal_range CHECK (weekly_goal_hours >= 1 AND weekly_goal_hours <= 168),
ADD CONSTRAINT monthly_goal_range CHECK (monthly_goal_hours >= 1 AND monthly_goal_hours <= 744),
ADD CONSTRAINT focus_duration_range CHECK (focus_duration_minutes >= 5 AND focus_duration_minutes <= 120),
ADD CONSTRAINT break_duration_range CHECK (break_duration_minutes >= 1 AND break_duration_minutes <= 30);

-- Limite de tamanho do nome da matéria
ALTER TABLE public.subjects
ADD CONSTRAINT name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 50);

-- Limite de tamanho do nome do perfil
ALTER TABLE public.profiles
ADD CONSTRAINT full_name_length CHECK (full_name IS NULL OR char_length(full_name) <= 100);

-- Index adicional para queries comuns
CREATE INDEX IF NOT EXISTS idx_sessions_user_type_started
ON public.study_sessions(user_id, type, started_at);

CREATE INDEX IF NOT EXISTS idx_subjects_user_archived
ON public.subjects(user_id, is_archived);
