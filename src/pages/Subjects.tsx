import { Plus } from "lucide-react";
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

const initialSubjects = [
  { name: "Matemática Avançada", color: "indigo", sessions: 24, hours: "36" },
  { name: "Química Orgânica", color: "emerald", sessions: 18, hours: "27" },
  { name: "Direito Constitucional", color: "amber", sessions: 15, hours: "22,5" },
  { name: "Estrutura de Dados", color: "sky", sessions: 20, hours: "30" },
  { name: "Biologia Molecular", color: "rose", sessions: 12, hours: "18" },
  { name: "Estatística", color: "violet", sessions: 10, hours: "15" },
];

const colorOptions = ["indigo", "emerald", "amber", "sky", "rose", "violet"];

export default function Subjects() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("indigo");
  const [open, setOpen] = useState(false);

  const addSubject = () => {
    if (!newName.trim()) return;
    setSubjects([...subjects, { name: newName, color: newColor, sessions: 0, hours: "0" }]);
    setNewName("");
    setNewColor("indigo");
    setOpen(false);
  };

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
              <Button onClick={addSubject} className="w-full">Criar Matéria</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {subjects.map((subject) => (
          <SubjectBadge key={subject.name} {...subject} />
        ))}
      </div>
    </div>
  );
}
