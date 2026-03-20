import { Plus, Loader2, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubjectBadge from "@/components/SubjectBadge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubjects, useCreateSubject, useDeleteSubject } from "@/hooks/useSubjects";
import { useStudySessions } from "@/hooks/useStudySessions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const colorOptions = ["indigo", "emerald", "amber", "sky", "rose", "violet"];

export default function Subjects() {
  const { data: subjects = [], isLoading } = useSubjects();
  const { data: allSessions = [] } = useStudySessions();
  const createSubject = useCreateSubject();
  const deleteSubject = useDeleteSubject();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("indigo");
  const [open, setOpen] = useState(false);

  const addSubject = async () => {
    if (!newName.trim()) return;
    try {
      await createSubject.mutateAsync({ name: newName.trim(), color: newColor });
      setNewName("");
      setNewColor("indigo");
      setOpen(false);
      toast.success("Matéria criada!");
    } catch {
      toast.error("Erro ao criar matéria. Talvez já exista uma com esse nome.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteSubject.mutateAsync(id);
      toast.success(`${name} arquivada.`);
    } catch {
      toast.error("Erro ao arquivar matéria.");
    }
  };

  const getSubjectStats = (subjectId: string) => {
    const sessions = allSessions.filter((s) => s.subject_id === subjectId);
    const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration_seconds ?? 0), 0);
    return {
      sessions: sessions.length,
      hours: (totalSeconds / 3600).toFixed(1).replace(".", ","),
    };
  };

  if (isLoading) {
    return (
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Matérias</h1>
          <p className="text-muted-foreground mt-1">{subjects.length} matérias ativas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="default">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Matéria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Nome</Label>
                <Input
                  placeholder="Ex: Matemática Avançada"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Cor</Label>
                <div className="flex gap-2 mt-1.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-default ${
                        c === newColor ? "border-primary scale-110" : "border-transparent"
                      }`}
                      style={{
                        backgroundColor:
                          c === "indigo" ? "hsl(243, 75%, 59%)" :
                          c === "emerald" ? "hsl(142, 71%, 45%)" :
                          c === "amber" ? "hsl(38, 92%, 50%)" :
                          c === "sky" ? "hsl(199, 89%, 48%)" :
                          c === "rose" ? "hsl(347, 77%, 50%)" :
                          "hsl(263, 70%, 50%)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={addSubject} className="w-full" disabled={createSubject.isPending}>
                {createSubject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Matéria"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 ? (
        <div className="rounded-2xl bg-card p-6 shadow-card text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">Adicione sua primeira matéria para começar!</p>
          <Button onClick={() => setOpen(true)} variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            Nova Matéria
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject.id);
            return (
              <div key={subject.id} className="relative group">
                <SubjectBadge
                  name={subject.name}
                  color={subject.color}
                  sessions={stats.sessions}
                  hours={stats.hours}
                />
                <button
                  onClick={() => handleDelete(subject.id, subject.name)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
