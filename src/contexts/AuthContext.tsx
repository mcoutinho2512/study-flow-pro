import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function sanitizeAuthError(error: AuthError): string {
  const code = error.message?.toLowerCase() ?? "";
  if (code.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (code.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (code.includes("user already registered")) return "Este e-mail já está cadastrado.";
  if (code.includes("rate limit")) return "Muitas tentativas. Aguarde alguns minutos.";
  if (code.includes("weak password")) return "Senha muito fraca. Use pelo menos 8 caracteres.";
  return "Erro inesperado. Tente novamente.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch {
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Capacitor: escuta deep links para OAuth callback
    if (Capacitor.isNativePlatform()) {
      App.addListener('appUrlOpen', async ({ url }) => {
        if (url.includes('access_token') || url.includes('code=') || url.includes('login')) {
          // Extrai tokens do fragmento da URL
          const hashPart = url.split('#')[1];
          if (hashPart) {
            const params = new URLSearchParams(hashPart);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            if (accessToken && refreshToken) {
              await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            }
          }
        }
      });
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    return { error: error ? sanitizeAuthError(error) : null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    return { error: error ? sanitizeAuthError(error) : null };
  };

  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    try {
      const isNative = Capacitor.isNativePlatform();
      const redirectTo = isNative
        ? 'com.studyflow.app://login'
        : window.location.origin;

      if (isNative) {
        // No mobile: gera a URL e abre no Safari do sistema
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            skipBrowserRedirect: true,
          },
        });

        if (error) {
          console.error('[Auth] Google OAuth error:', error.message);
          return { error: "Erro ao conectar com Google. Tente novamente." };
        }

        if (data?.url) {
          // Abre no Safari nativo do sistema
          window.open(data.url, '_system');
        }
      } else {
        // Na web: fluxo normal de redirect
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });

        if (error) {
          console.error('[Auth] Google OAuth error:', error.message);
          return { error: "Erro ao conectar com Google. Tente novamente." };
        }
      }

      return { error: null };
    } catch (err) {
      console.error('[Auth] Google OAuth catch:', err);
      return { error: "Erro ao conectar com Google. Tente novamente." };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
