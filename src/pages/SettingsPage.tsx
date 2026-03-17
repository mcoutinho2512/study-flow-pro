import { Bell, Calendar, Moon, Shield, LogOut, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function SettingsPage() {
  return (
    <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">Configurações</h1>

      <div className="rounded-2xl bg-card p-5 shadow-card mb-6 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Usuário StudyFlow</p>
          <p className="text-sm text-muted-foreground">usuario@exemplo.com</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card shadow-card mb-4 overflow-hidden">
        <SettingItem icon={Bell} label="Notificações" description="Lembretes, alertas, resumos" />
        <SettingItem icon={Calendar} label="Google Calendar" description="Conectar e sincronizar" />
        <SettingItem icon={Moon} label="Aparência" description="Tema e exibição" />
        <SettingItem icon={Shield} label="Privacidade e Segurança" description="Proteção da conta" />
      </div>

      <div className="rounded-2xl bg-card shadow-card overflow-hidden">
        <SettingItem icon={LogOut} label="Sair" danger />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">StudyFlow v1.0.0</p>
    </div>
  );
}
