import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const ATTEMPT_COOLDOWN_MS = 2000; // 2 seconds between attempts

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();

  const loginAttempts = useRef(0);
  const lastAttemptTime = useRef(0);
  const lockoutUntil = useRef(0);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now < lockoutUntil.current) {
      const minutesLeft = Math.ceil((lockoutUntil.current - now) / 60000);
      toast.error(`Conta bloqueada. Tente novamente em ${minutesLeft} minuto(s).`);
      return false;
    }
    if (now - lastAttemptTime.current < ATTEMPT_COOLDOWN_MS) {
      toast.error("Aguarde antes de tentar novamente.");
      return false;
    }
    return true;
  };

  const recordAttempt = (success: boolean) => {
    lastAttemptTime.current = Date.now();
    if (success) {
      loginAttempts.current = 0;
    } else {
      loginAttempts.current++;
      if (loginAttempts.current >= MAX_LOGIN_ATTEMPTS) {
        lockoutUntil.current = Date.now() + LOCKOUT_DURATION_MS;
        loginAttempts.current = 0;
        toast.error("Muitas tentativas. Conta bloqueada por 10 minutos.");
      }
    }
  };

  const validateInputs = (): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      toast.error("Informe um e-mail válido.");
      return false;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
      return false;
    }
    if (!isLogin && !fullName.trim()) {
      toast.error("Preencha seu nome.");
      return false;
    }
    if (!isLogin && fullName.trim().length > 100) {
      toast.error("Nome muito longo (máximo 100 caracteres).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    if (!checkRateLimit()) return;

    setLoading(true);
    if (isLogin) {
      const { error } = await signInWithEmail(email, password);
      recordAttempt(!error);
      if (error) {
        toast.error(error);
      } else {
        navigate("/");
      }
    } else {
      const { error } = await signUpWithEmail(email, password, fullName);
      recordAttempt(!error);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    if (!checkRateLimit()) return;
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  const handleApple = async () => {
    if (!checkRateLimit()) return;
    setLoading(true);
    const { error } = await signInWithApple();
    if (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">StudyFlow</h1>
          <p className="text-sm text-muted-foreground mt-1">Disciplina profissional.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Nome</Label>
              <Input
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 h-11"
                disabled={loading}
                maxLength={100}
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <Label className="text-xs font-medium text-muted-foreground">E-mail</Label>
            <Input
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Senha</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11"
              disabled={loading}
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isLogin ? "Entrar" : "Criar Conta"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">ou</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" size="lg" className="w-full" onClick={handleApple} disabled={loading}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continuar com Apple
          </Button>

          <Button variant="outline" size="lg" className="w-full" onClick={handleGoogle} disabled={loading}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
            disabled={loading}
          >
            {isLogin ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
