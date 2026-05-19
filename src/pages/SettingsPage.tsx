import { Bell, Moon, LogOut, ChevronRight, User, Target, Timer, Sun, Monitor, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon: Icon, label, description, onClick, danger }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-4 text-left transition-default hover:bg-secondary rounded-xl",
        danger && "text-destructive"
      )}
    >
      <div className={cn(
        "h-9 w-9 rounded-lg flex items-center justify-center",
        danger ? "bg-destructive/10" : "bg-primary/10"
      )}>
        <Icon className={cn("h-4.5 w-4.5", danger ? "text-destructive" : "text-primary")} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function validateNumber(value: string, min: number, max: number, label: string): number {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) {
    throw new Error(`${label} deve estar entre ${min} e ${max}.`);
  }
  return num;
}

type ThemeMode = "light" | "dark" | "system";

function getStoredTheme(): ThemeMode {
  return (localStorage.getItem("estudae-theme") as ThemeMode) || "system";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", mode === "dark");
  }
  localStorage.setItem("estudae-theme", mode);
}

export default function SettingsPage() {
  const { user, signOut, deleteAccount } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const [dailyGoal, setDailyGoal] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [focusDuration, setFocusDuration] = useState("");
  const [breakDuration, setBreakDuration] = useState("");

  // Notificações
  const [notifStudyReminder, setNotifStudyReminder] = useState(() => localStorage.getItem("notif-study-reminder") !== "false");
  const [notifSessionEnd, setNotifSessionEnd] = useState(() => localStorage.getItem("notif-session-end") !== "false");
  const [notifWeeklyReport, setNotifWeeklyReport] = useState(() => localStorage.getItem("notif-weekly-report") !== "false");

  // Tema
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme);

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "EXCLUIR") {
      toast.error('Digite "EXCLUIR" para confirmar.');
      return;
    }
    setDeleting(true);
    const { error } = await deleteAccount();
    if (error) {
      toast.error(error);
      setDeleting(false);
    } else {
      toast.success("Conta excluída com sucesso.");
      navigate("/auth");
    }
  };

  const openGoals = () => {
    setDailyGoal(String(profile?.daily_goal_hours ?? 4));
    setWeeklyGoal(String(profile?.weekly_goal_hours ?? 25));
    setMonthlyGoal(String(profile?.monthly_goal_hours ?? 120));
    setGoalsOpen(true);
  };

  const saveGoals = async () => {
    try {
      const daily = validateNumber(dailyGoal, 0.5, 24, "Meta diária");
      const weekly = validateNumber(weeklyGoal, 1, 168, "Meta semanal");
      const monthly = validateNumber(monthlyGoal, 1, 744, "Meta mensal");

      await updateProfile.mutateAsync({
        daily_goal_hours: daily,
        weekly_goal_hours: weekly,
        monthly_goal_hours: monthly,
      });
      toast.success("Metas atualizadas!");
      setGoalsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar metas.");
    }
  };

  const openTimer = () => {
    setFocusDuration(String(profile?.focus_duration_minutes ?? 25));
    setBreakDuration(String(profile?.break_duration_minutes ?? 5));
    setTimerOpen(true);
  };

  const saveTimer = async () => {
    try {
      const focus = validateNumber(focusDuration, 5, 120, "Duração do foco");
      const breakMin = validateNumber(breakDuration, 1, 30, "Duração do intervalo");

      await updateProfile.mutateAsync({
        focus_duration_minutes: focus,
        break_duration_minutes: breakMin,
      });
      toast.success("Timer atualizado!");
      setTimerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar timer.");
    }
  };

  const saveNotifSetting = (key: string, value: boolean) => {
    localStorage.setItem(key, String(value));
  };

  const themeLabel = themeMode === "light" ? "Claro" : themeMode === "dark" ? "Escuro" : "Automático";

  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">Configurações</h1>

      <div className="rounded-2xl bg-card p-5 shadow-card mb-6 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="h-6 w-6 text-primary" />
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground">{profile?.full_name || "Usuário Estudae"}</p>
          <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card shadow-card mb-4 overflow-hidden">
        <SettingItem icon={Target} label="Metas de Estudo" description="Diária, semanal, mensal" onClick={openGoals} />
        <SettingItem icon={Timer} label="Timer Pomodoro" description={`${profile?.focus_duration_minutes ?? 25}min foco / ${profile?.break_duration_minutes ?? 5}min pausa`} onClick={openTimer} />
        <SettingItem icon={Bell} label="Notificações" description="Lembretes, alertas, resumos" onClick={() => setNotifOpen(true)} />
        <SettingItem icon={Moon} label="Aparência" description={`Tema: ${themeLabel}`} onClick={() => setThemeOpen(true)} />
      </div>

      <div className="rounded-2xl bg-card shadow-card overflow-hidden">
        <SettingItem icon={LogOut} label="Sair" danger onClick={handleLogout} />
      </div>

      <div className="rounded-2xl bg-card shadow-card overflow-hidden mt-4">
        <SettingItem icon={Trash2} label="Excluir minha conta" description="Apaga todos os seus dados permanentemente" danger onClick={() => { setDeleteConfirm(""); setDeleteOpen(true); }} />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">Estudae v1.0.0</p>

      {/* Dialog Excluir Conta */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Excluir Conta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Esta ação é <strong>permanente e irreversível</strong>. Todos os seus dados serão apagados:
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Matérias e anotações</li>
              <li>Sessões de estudo</li>
              <li>Planner semanal</li>
              <li>Metas e configurações</li>
              <li>Perfil e conta</li>
            </ul>
            <div>
              <Label className="text-sm">Digite <strong>EXCLUIR</strong> para confirmar:</Label>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value.toUpperCase())}
                placeholder="EXCLUIR"
                className="mt-1.5"
                disabled={deleting}
              />
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirm !== "EXCLUIR"}
            >
              {deleting ? "Excluindo..." : "Excluir minha conta permanentemente"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Metas */}
      <Dialog open={goalsOpen} onOpenChange={setGoalsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Metas de Estudo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Meta diária (horas)</Label>
              <Input type="number" step="0.5" min="0.5" max="24" value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Meta semanal (horas)</Label>
              <Input type="number" step="1" min="1" max="168" value={weeklyGoal} onChange={(e) => setWeeklyGoal(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Meta mensal (horas)</Label>
              <Input type="number" step="1" min="1" max="744" value={monthlyGoal} onChange={(e) => setMonthlyGoal(e.target.value)} className="mt-1.5" />
            </div>
            <Button onClick={saveGoals} className="w-full" disabled={updateProfile.isPending}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Timer */}
      <Dialog open={timerOpen} onOpenChange={setTimerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timer Pomodoro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Duração do foco (minutos)</Label>
              <Input type="number" step="5" min="5" max="120" value={focusDuration} onChange={(e) => setFocusDuration(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Duração do intervalo (minutos)</Label>
              <Input type="number" step="1" min="1" max="30" value={breakDuration} onChange={(e) => setBreakDuration(e.target.value)} className="mt-1.5" />
            </div>
            <Button onClick={saveTimer} className="w-full" disabled={updateProfile.isPending}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Notificações */}
      <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificações</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Lembrete de estudo</p>
                <p className="text-xs text-muted-foreground">Notificar para estudar diariamente</p>
              </div>
              <Switch
                checked={notifStudyReminder}
                onCheckedChange={(v) => { setNotifStudyReminder(v); saveNotifSetting("notif-study-reminder", v); }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Fim da sessão</p>
                <p className="text-xs text-muted-foreground">Alerta quando o timer finalizar</p>
              </div>
              <Switch
                checked={notifSessionEnd}
                onCheckedChange={(v) => { setNotifSessionEnd(v); saveNotifSetting("notif-session-end", v); }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Resumo semanal</p>
                <p className="text-xs text-muted-foreground">Relatório das suas horas de estudo</p>
              </div>
              <Switch
                checked={notifWeeklyReport}
                onCheckedChange={(v) => { setNotifWeeklyReport(v); saveNotifSetting("notif-weekly-report", v); }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Aparência */}
      <Dialog open={themeOpen} onOpenChange={setThemeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aparência</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {([
              { mode: "light" as ThemeMode, label: "Claro", icon: Sun, desc: "Tema claro" },
              { mode: "dark" as ThemeMode, label: "Escuro", icon: Moon, desc: "Tema escuro" },
              { mode: "system" as ThemeMode, label: "Automático", icon: Monitor, desc: "Segue o sistema" },
            ]).map(({ mode, label, icon: ThemeIcon, desc }) => (
              <button
                key={mode}
                onClick={() => { setThemeMode(mode); setThemeOpen(false); toast.success(`Tema: ${label}`); }}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
                  themeMode === mode
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-secondary"
                )}
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ThemeIcon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
