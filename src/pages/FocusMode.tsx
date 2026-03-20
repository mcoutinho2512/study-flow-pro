import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubjects } from "@/hooks/useSubjects";
import { useProfile } from "@/hooks/useProfile";
import { useCreateSession, useUpdateSession } from "@/hooks/useStudySessions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Phase = "focus" | "break";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}

export default function FocusMode() {
  const { data: subjects = [] } = useSubjects();
  const { data: profile } = useProfile();
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  const focusDuration = (profile?.focus_duration_minutes ?? 25) * 60;
  const breakDuration = (profile?.break_duration_minutes ?? 5) * 60;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [seconds, setSeconds] = useState(focusDuration);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("focus");
  const [sessionsCompleted, setSessions] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const timerStartRef = useRef<number | null>(null);
  const timerSecondsAtStart = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const totalSeconds = phase === "focus" ? focusDuration : breakDuration;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  useEffect(() => {
    if (!isActive && phase === "focus" && !currentSessionId) setSeconds(focusDuration);
  }, [focusDuration]);

  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  const saveSession = useCallback(async () => {
    if (!currentSessionId || !startedAtRef.current) return;
    const now = new Date();
    const durationSecs = Math.max(0, Math.round((now.getTime() - startedAtRef.current.getTime()) / 1000));

    try {
      await withRetry(() =>
        updateSession.mutateAsync({
          id: currentSessionId,
          ended_at: now.toISOString(),
          duration_seconds: durationSecs,
        })
      );
    } catch {
      toast.error("Falha ao salvar sessão. Verifique sua conexão.");
    }
    setCurrentSessionId(null);
    startedAtRef.current = null;
  }, [currentSessionId, updateSession]);

  // Accurate timer using requestAnimationFrame + Date.now
  useEffect(() => {
    if (!isActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timerStartRef.current = null;
      return;
    }

    timerStartRef.current = Date.now();
    timerSecondsAtStart.current = seconds;

    const tick = () => {
      if (!timerStartRef.current) return;
      const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
      const newSeconds = Math.max(0, timerSecondsAtStart.current - elapsed);

      setSeconds(newSeconds);

      if (newSeconds <= 0) {
        setIsActive(false);
        if (phase === "focus") {
          setSessions((c) => c + 1);
          saveSession();
          setPhase("break");
          setSeconds(breakDuration);
        } else {
          setPhase("focus");
          setSeconds(focusDuration);
        }
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, phase, breakDuration, focusDuration, saveSession]);

  // Recalculate on app resume (mobile background)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && isActive && timerStartRef.current) {
        const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
        const newSeconds = Math.max(0, timerSecondsAtStart.current - elapsed);
        setSeconds(newSeconds);
        if (newSeconds <= 0) {
          setIsActive(false);
          if (phase === "focus") {
            setSessions((c) => c + 1);
            saveSession();
            toast.success("Sessão completada!");
          }
          setPhase(phase === "focus" ? "break" : "focus");
          setSeconds(phase === "focus" ? breakDuration : focusDuration);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isActive, phase, breakDuration, focusDuration, saveSession]);

  const handlePlayPause = async () => {
    if (!isActive) {
      if (phase === "focus" && !currentSessionId && selectedSubjectId) {
        try {
          const session = await createSession.mutateAsync({ subject_id: selectedSubjectId });
          setCurrentSessionId(session.id);
          startedAtRef.current = new Date();
        } catch {
          toast.error("Erro ao iniciar sessão. Verifique sua conexão.");
          return;
        }
      }
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const reset = () => {
    setIsActive(false);
    if (currentSessionId) saveSession();
    setPhase("focus");
    setSeconds(focusDuration);
  };

  const completeManual = () => {
    setIsActive(false);
    if (phase === "focus") {
      setSessions((c) => c + 1);
      saveSession();
      toast.success("Sessão salva!");
    }
    setPhase("focus");
    setSeconds(focusDuration);
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const radius = 140;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-foreground px-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          {phase === "focus" ? "Foco Profundo" : "Intervalo"}
        </span>

        {subjects.length > 0 && !isActive && (
          <div className="mb-6">
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger className="w-56 bg-transparent border-muted/30 text-background">
                <SelectValue placeholder="Selecione a matéria" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="relative mb-8">
          <svg width={320} height={320} className="-rotate-90">
            <circle cx={160} cy={160} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
            <circle
              cx={160} cy={160} r={radius} fill="none"
              stroke={phase === "focus" ? "hsl(243, 75%, 59%)" : "hsl(142, 71%, 45%)"}
              strokeWidth={4} strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" className="transition-all duration-300 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={Math.floor(seconds / 60)}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="text-7xl font-light tracking-tighter tabular-nums text-background"
              >
                {minutes}:{secs.toString().padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-muted-foreground tracking-widest uppercase text-xs mb-12">
          {selectedSubject?.name ?? "Selecione uma matéria"}
        </p>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost" size="icon" onClick={reset}
            className="text-muted-foreground hover:text-background hover:bg-muted/20 h-12 w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            onClick={handlePlayPause}
            className="h-16 w-16 rounded-full bg-background text-foreground hover:bg-background/90 shadow-elevated"
            size="icon"
            disabled={!selectedSubjectId && phase === "focus"}
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </Button>

          <Button
            variant="ghost" size="icon"
            onClick={completeManual}
            className="text-muted-foreground hover:text-accent hover:bg-accent/10 h-12 w-12"
          >
            <Check className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-10 flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-default ${
                i < sessionsCompleted ? "bg-primary" : "bg-muted/30"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-2 tabular-nums">
            {sessionsCompleted}/4 sessões
          </span>
        </div>
      </motion.div>
    </div>
  );
}
