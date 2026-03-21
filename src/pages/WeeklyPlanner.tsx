import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, List, ChevronLeft, ChevronRight, Play, Check, X, Clock, Pencil, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSubjects } from "@/hooks/useSubjects";
import {
  usePlannerBlocks,
  useCreatePlannerBlock,
  useUpdatePlannerBlock,
  useDeletePlannerBlock,
  DAYS_OF_WEEK,
  HOURS,
  SESSION_TYPE_LABELS,
  STATUS_LABELS,
  type PlannerBlockWithSubject,
  type SessionType,
  type BlockStatus,
} from "@/hooks/usePlannerBlocks";

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string }> = {
  indigo: { bg: "bg-indigo-500", text: "text-indigo-700", border: "border-indigo-300", light: "bg-indigo-50" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-300", light: "bg-emerald-50" },
  amber: { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-300", light: "bg-amber-50" },
  sky: { bg: "bg-sky-500", text: "text-sky-700", border: "border-sky-300", light: "bg-sky-50" },
  rose: { bg: "bg-rose-500", text: "text-rose-700", border: "border-rose-300", light: "bg-rose-50" },
  violet: { bg: "bg-violet-500", text: "text-violet-700", border: "border-violet-300", light: "bg-violet-50" },
};

const STATUS_COLORS: Record<string, string> = {
  planned: "bg-gray-400",
  in_progress: "bg-amber-400",
  completed: "bg-emerald-400",
  missed: "bg-rose-400",
};

type ViewMode = "week" | "day";

interface BlockFormData {
  title: string;
  subject_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  color: string;
  session_type: string;
  notes: string;
}

const DEFAULT_FORM: BlockFormData = {
  title: "",
  subject_id: "",
  day_of_week: 0,
  start_time: "08:00",
  end_time: "09:00",
  color: "indigo",
  session_type: "estudo",
  notes: "",
};

export default function WeeklyPlanner() {
  const navigate = useNavigate();
  const { data: blocks = [], isLoading, isError, refetch } = usePlannerBlocks();
  const { data: subjects = [] } = useSubjects();
  const createBlock = useCreatePlannerBlock();
  const updateBlock = useUpdatePlannerBlock();
  const deleteBlock = useDeletePlannerBlock();

  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Convert JS Sunday=0 to our Monday=0
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBlock, setEditingBlock] = useState<PlannerBlockWithSubject | null>(null);
  const [form, setForm] = useState<BlockFormData>(DEFAULT_FORM);

  // Group blocks by day
  const blocksByDay = useMemo(() => {
    const grouped: Record<number, PlannerBlockWithSubject[]> = {};
    for (let i = 0; i < 7; i++) grouped[i] = [];
    blocks.forEach((b) => {
      if (grouped[b.day_of_week]) grouped[b.day_of_week].push(b);
    });
    return grouped;
  }, [blocks]);

  const openAddDialog = useCallback((day?: number, hour?: number) => {
    setForm({
      ...DEFAULT_FORM,
      day_of_week: day ?? selectedDay,
      start_time: hour !== undefined ? `${String(hour).padStart(2, "0")}:00` : "08:00",
      end_time: hour !== undefined ? `${String(hour + 1).padStart(2, "0")}:00` : "09:00",
    });
    setEditingBlock(null);
    setShowAddDialog(true);
  }, [selectedDay]);

  const openEditDialog = useCallback((block: PlannerBlockWithSubject) => {
    setForm({
      title: block.title,
      subject_id: block.subject_id || "",
      day_of_week: block.day_of_week,
      start_time: block.start_time.slice(0, 5),
      end_time: block.end_time.slice(0, 5),
      color: block.color,
      session_type: block.session_type,
      notes: block.notes || "",
    });
    setEditingBlock(block);
    setShowAddDialog(true);
  }, []);

  const handleSubjectSelect = useCallback((subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      setForm((f) => ({ ...f, subject_id: subjectId, color: subject.color, title: f.title || subject.name }));
    } else {
      setForm((f) => ({ ...f, subject_id: subjectId }));
    }
  }, [subjects]);

  const handleSave = async () => {
    try {
      if (editingBlock) {
        await updateBlock.mutateAsync({
          id: editingBlock.id,
          title: form.title,
          subject_id: form.subject_id || null,
          day_of_week: form.day_of_week,
          start_time: form.start_time,
          end_time: form.end_time,
          color: form.color,
          session_type: form.session_type,
          notes: form.notes || null,
        });
        toast.success("Bloco atualizado!");
      } else {
        await createBlock.mutateAsync({
          title: form.title,
          subject_id: form.subject_id || null,
          day_of_week: form.day_of_week,
          start_time: form.start_time,
          end_time: form.end_time,
          color: form.color,
          session_type: form.session_type,
          notes: form.notes || null,
        });
        toast.success("Bloco criado!");
      }
      setShowAddDialog(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar bloco.");
    }
  };

  const handleDelete = async () => {
    if (!editingBlock) return;
    try {
      await deleteBlock.mutateAsync(editingBlock.id);
      toast.success("Bloco removido!");
      setShowAddDialog(false);
    } catch {
      toast.error("Erro ao remover bloco.");
    }
  };

  const handleStatusChange = async (block: PlannerBlockWithSubject, status: BlockStatus) => {
    try {
      await updateBlock.mutateAsync({ id: block.id, status });
      toast.success(`Bloco marcado como ${STATUS_LABELS[status]}`);
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleStartFocus = (block: PlannerBlockWithSubject) => {
    if (block.subject_id) {
      navigate(`/focus?subject=${block.subject_id}`);
    } else {
      navigate("/focus");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-muted-foreground">Erro ao carregar o planner.</p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Plano Semanal</h1>
            <p className="text-xs text-muted-foreground">Organize seus horários de estudo</p>
          </div>
          <Button size="sm" onClick={() => openAddDialog()} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Bloco
          </Button>
        </div>

        {/* View Toggle + Day Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                viewMode === "week" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              Semana
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                viewMode === "day" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              )}
            >
              <List className="h-3.5 w-3.5" />
              Dia
            </button>
          </div>

          {viewMode === "day" && (
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setSelectedDay((d) => (d - 1 + 7) % 7)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold min-w-[80px] text-center">
                {DAYS_OF_WEEK[selectedDay].full}
              </span>
              <button
                onClick={() => setSelectedDay((d) => (d + 1) % 7)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === "week" ? (
          <WeekView blocks={blocksByDay} onCellClick={openAddDialog} onBlockClick={openEditDialog} />
        ) : (
          <DayView
            blocks={blocksByDay[selectedDay] || []}
            day={selectedDay}
            onAddClick={() => openAddDialog(selectedDay)}
            onBlockClick={openEditDialog}
            onStatusChange={handleStatusChange}
            onStartFocus={handleStartFocus}
          />
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlock ? "Editar Bloco" : "Novo Bloco de Estudo"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Subject select */}
            <div className="space-y-1.5">
              <Label>Matéria</Label>
              <Select value={form.subject_id} onValueChange={handleSubjectSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma matéria (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        <span className={cn("w-2.5 h-2.5 rounded-full", COLOR_MAP[s.color]?.bg)} />
                        {s.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Cálculo - Cap. 3"
                maxLength={100}
              />
            </div>

            {/* Day */}
            <div className="space-y-1.5">
              <Label>Dia da Semana</Label>
              <Select value={String(form.day_of_week)} onValueChange={(v) => setForm((f) => ({ ...f, day_of_week: Number(v) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((d) => (
                    <SelectItem key={d.value} value={String(d.value)}>{d.full}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Início</Label>
                <Input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Término</Label>
                <Input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                />
              </div>
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <Label>Cor</Label>
              <div className="flex gap-2">
                {Object.entries(COLOR_MAP).map(([key, colors]) => (
                  <button
                    key={key}
                    onClick={() => setForm((f) => ({ ...f, color: key }))}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      colors.bg,
                      form.color === key ? "ring-2 ring-offset-2 ring-primary scale-110" : "opacity-60 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Session Type */}
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={form.session_type} onValueChange={(v) => setForm((f) => ({ ...f, session_type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SESSION_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Observação</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Anotações opcionais..."
                rows={2}
                maxLength={1000}
              />
            </div>
          </div>

          <DialogFooter className="flex-row gap-2">
            {editingBlock && (
              <Button variant="destructive" size="sm" onClick={handleDelete} className="mr-auto gap-1">
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleSave}
              disabled={!form.title.trim() || createBlock.isPending || updateBlock.isPending}
            >
              {editingBlock ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// Week View - Grid semanal
// ============================================================
function WeekView({
  blocks,
  onCellClick,
  onBlockClick,
}: {
  blocks: Record<number, PlannerBlockWithSubject[]>;
  onCellClick: (day: number, hour: number) => void;
  onBlockClick: (block: PlannerBlockWithSubject) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Day headers */}
        <div className="sticky top-0 z-10 grid grid-cols-[50px_repeat(7,1fr)] bg-background border-b border-border">
          <div className="p-2" />
          {DAYS_OF_WEEK.map((day) => {
            const today = new Date().getDay();
            const isToday = (today === 0 ? 6 : today - 1) === day.value;
            return (
              <div
                key={day.value}
                className={cn(
                  "p-2 text-center text-xs font-semibold border-l border-border",
                  isToday ? "text-primary bg-primary/5" : "text-muted-foreground"
                )}
              >
                {day.short}
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-border/50 min-h-[52px]">
            {/* Hour label */}
            <div className="p-1 text-[10px] text-muted-foreground text-right pr-2 pt-1 tabular-nums">
              {String(hour).padStart(2, "0")}:00
            </div>

            {/* Day cells */}
            {DAYS_OF_WEEK.map((day) => {
              const cellBlocks = blocks[day.value]?.filter((b) => {
                const blockHour = parseInt(b.start_time.split(":")[0]);
                return blockHour === hour;
              }) || [];

              return (
                <div
                  key={day.value}
                  onClick={() => cellBlocks.length === 0 && onCellClick(day.value, hour)}
                  className={cn(
                    "border-l border-border/50 p-0.5 min-h-[52px] transition-colors",
                    cellBlocks.length === 0 && "hover:bg-muted/50 cursor-pointer"
                  )}
                >
                  {cellBlocks.map((block) => (
                    <WeekBlockCard key={block.id} block={block} onClick={() => onBlockClick(block)} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekBlockCard({ block, onClick }: { block: PlannerBlockWithSubject; onClick: () => void }) {
  const colors = COLOR_MAP[block.color] || COLOR_MAP.indigo;
  const height = Math.max(block.duration_minutes * 0.8, 40);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{ minHeight: `${height}px` }}
      className={cn(
        "w-full rounded-md px-1.5 py-1 text-left transition-all hover:shadow-md",
        "border-l-[3px]",
        colors.light, colors.border, colors.text
      )}
    >
      <p className="text-[10px] font-semibold leading-tight truncate">{block.title}</p>
      <p className="text-[9px] opacity-70 tabular-nums">
        {block.start_time.slice(0, 5)}
      </p>
      <span className={cn("inline-block w-1.5 h-1.5 rounded-full mt-0.5", STATUS_COLORS[block.status])} />
    </button>
  );
}

// ============================================================
// Day View - Timeline do dia
// ============================================================
function DayView({
  blocks,
  day,
  onAddClick,
  onBlockClick,
  onStatusChange,
  onStartFocus,
}: {
  blocks: PlannerBlockWithSubject[];
  day: number;
  onAddClick: () => void;
  onBlockClick: (block: PlannerBlockWithSubject) => void;
  onStatusChange: (block: PlannerBlockWithSubject, status: BlockStatus) => void;
  onStartFocus: (block: PlannerBlockWithSubject) => void;
}) {
  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <BookOpen className="h-7 w-7 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Nenhum bloco em {DAYS_OF_WEEK[day].full}</p>
          <p className="text-sm text-muted-foreground mt-1">Adicione um bloco de estudo para começar</p>
        </div>
        <Button onClick={onAddClick} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Criar primeiro bloco
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {blocks.map((block) => (
        <DayBlockCard
          key={block.id}
          block={block}
          onEdit={() => onBlockClick(block)}
          onStatusChange={onStatusChange}
          onStartFocus={() => onStartFocus(block)}
        />
      ))}

      <button
        onClick={onAddClick}
        className="w-full border-2 border-dashed border-border rounded-xl py-4 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar bloco
      </button>
    </div>
  );
}

function DayBlockCard({
  block,
  onEdit,
  onStatusChange,
  onStartFocus,
}: {
  block: PlannerBlockWithSubject;
  onEdit: () => void;
  onStatusChange: (block: PlannerBlockWithSubject, status: BlockStatus) => void;
  onStartFocus: () => void;
}) {
  const colors = COLOR_MAP[block.color] || COLOR_MAP.indigo;

  return (
    <div className={cn(
      "rounded-xl border-l-4 bg-card shadow-sm p-4 transition-all hover:shadow-md",
      colors.border.replace("border-", "border-l-")
    )}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{block.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
              <Clock className="h-3 w-3" />
              {block.start_time.slice(0, 5)} — {block.end_time.slice(0, 5)}
            </span>
            <span className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
              colors.light, colors.text
            )}>
              {SESSION_TYPE_LABELS[block.session_type as SessionType] || block.session_type}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <span className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-full text-white ml-2 shrink-0",
          STATUS_COLORS[block.status]
        )}>
          {STATUS_LABELS[block.status as BlockStatus] || block.status}
        </span>
      </div>

      {/* Notes */}
      {block.notes && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{block.notes}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 px-2" onClick={onStartFocus}>
          <Play className="h-3 w-3" />
          Foco
        </Button>

        {block.status !== "completed" && (
          <Button
            size="sm" variant="ghost"
            className="h-7 text-xs gap-1 px-2 text-emerald-600 hover:text-emerald-700"
            onClick={() => onStatusChange(block, "completed")}
          >
            <Check className="h-3 w-3" />
            Concluir
          </Button>
        )}

        {block.status === "completed" && (
          <Button
            size="sm" variant="ghost"
            className="h-7 text-xs gap-1 px-2 text-amber-600 hover:text-amber-700"
            onClick={() => onStatusChange(block, "planned")}
          >
            Reabrir
          </Button>
        )}

        {block.status !== "missed" && block.status !== "completed" && (
          <Button
            size="sm" variant="ghost"
            className="h-7 text-xs gap-1 px-2 text-rose-500 hover:text-rose-600"
            onClick={() => onStatusChange(block, "missed")}
          >
            <X className="h-3 w-3" />
            Perdido
          </Button>
        )}

        <Button size="sm" variant="ghost" className="h-7 px-2 ml-auto" onClick={onEdit}>
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
