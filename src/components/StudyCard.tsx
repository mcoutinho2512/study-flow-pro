import { cn } from "@/lib/utils";
import { Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudyCardProps {
  subject: string;
  topic?: string;
  startTime: string;
  endTime: string;
  duration: string;
  color?: string;
  isNext?: boolean;
  onStart?: () => void;
}

export default function StudyCard({
  subject,
  topic,
  startTime,
  endTime,
  duration,
  isNext = false,
  onStart,
}: StudyCardProps) {
  if (isNext) {
    return (
      <div className="rounded-2xl bg-primary p-5 shadow-elevated">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
            Up Next
          </span>
          <Button
            variant="hero"
            size="sm"
            className="bg-card/20 hover:bg-card/30 text-primary-foreground backdrop-blur-sm border-0"
            onClick={onStart}
          >
            <Play className="h-3.5 w-3.5" />
            Start
          </Button>
        </div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-primary-foreground">
          {subject}
        </h3>
        {topic && (
          <p className="text-sm text-primary-foreground/70 mt-0.5">{topic}</p>
        )}
        <div className="flex items-center gap-2 mt-4 text-primary-foreground/80">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-sm tabular-nums">
            {startTime} — {endTime} ({duration})
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 py-3">
      <span className="w-12 text-sm tabular-nums text-muted-foreground">{startTime}</span>
      <div className="flex-1 border-l-2 border-border pl-4 py-1">
        <p className="font-medium text-foreground">{subject}</p>
        {topic && <p className="text-sm text-muted-foreground">{topic}</p>}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{duration}</span>
    </div>
  );
}
