import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "focus" | "break";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export default function FocusMode() {
  const [seconds, setSeconds] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("focus");
  const [sessionsCompleted, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = phase === "focus" ? FOCUS_DURATION : BREAK_DURATION;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  const tick = useCallback(() => {
    setSeconds((s) => {
      if (s <= 1) {
        setIsActive(false);
        if (phase === "focus") {
          setSessions((c) => c + 1);
          setPhase("break");
          return BREAK_DURATION;
        } else {
          setPhase("focus");
          return FOCUS_DURATION;
        }
      }
      return s - 1;
    });
  }, [phase]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, tick]);

  const reset = () => {
    setIsActive(false);
    setPhase("focus");
    setSeconds(FOCUS_DURATION);
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
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8">
          {phase === "focus" ? "Foco Profundo" : "Intervalo"}
        </span>

        <div className="relative mb-8">
          <svg width={320} height={320} className="-rotate-90">
            <circle cx={160} cy={160} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
            <circle
              cx={160} cy={160} r={radius} fill="none"
              stroke={phase === "focus" ? "hsl(243, 75%, 59%)" : "hsl(142, 71%, 45%)"}
              strokeWidth={4} strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={seconds}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-7xl font-light tracking-tighter tabular-nums text-background"
              >
                {minutes}:{secs.toString().padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-muted-foreground tracking-widest uppercase text-xs mb-12">
          Química Orgânica
        </p>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost" size="icon" onClick={reset}
            className="text-muted-foreground hover:text-background hover:bg-muted/20 h-12 w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => setIsActive(!isActive)}
            className="h-16 w-16 rounded-full bg-background text-foreground hover:bg-background/90 shadow-elevated"
            size="icon"
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </Button>

          <Button
            variant="ghost" size="icon"
            onClick={() => {
              setIsActive(false);
              setSessions((c) => c + 1);
              setPhase("focus");
              setSeconds(FOCUS_DURATION);
            }}
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
