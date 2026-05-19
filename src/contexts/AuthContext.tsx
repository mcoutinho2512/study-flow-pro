import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { SignInWithApple, type SignInWithAppleResponse } from "@capacitor-community/apple-sign-in";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithApple: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: string | null }>;
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

    // Safety timeout: se getSession travar (iPad/WebView), força loading=false em 5s
    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

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
        clearTimeout(safetyTimeout);
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
    const EXPECTED_SCHEME = 'br.com.mcconsultoriati.estudae://';
    if (Capacitor.isNativePlatform()) {
      App.addListener('appUrlOpen', async ({ url }) => {
        if (!url.startsWith(EXPECTED_SCHEME)) return;

        // Fecha o browser in-app assim que o callback chegar
        try { await Browser.close(); } catch {}

        const hashPart = url.split('#')[1];
        if (!hashPart) return;

        const params = new URLSearchParams(hashPart);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (!accessToken || !refreshToken) return;

        try {
          await Promise.race([
            supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('setSession timeout')), 10000)),
          ]);
        } catch (err) {
          console.error('[Auth] setSession error:', err);
        }
      });
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const signInPromise = supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      const timeoutPromise = new Promise<{ error: AuthError }>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 15000)
      );
      const { error } = await Promise.race([signInPromise, timeoutPromise]);
      return { error: error ? sanitizeAuthError(error) : null };
    } catch {
      return { error: "Tempo esgotado. Verifique sua conexão e tente novamente." };
    }
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
        ? 'br.com.mcconsultoriati.estudae://login'
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
          await Browser.open({ url: data.url, presentationStyle: 'popover' });
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

  const signInWithApple = async (): Promise<{ error: string | null }> => {
    try {
      const isIOS = Capacitor.getPlatform() === 'ios';

      if (isIOS) {
        // Gera um nonce aleatório e sua hash SHA256
        const rawNonce = crypto.randomUUID();
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(rawNonce));
        const hashedNonce = Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        // Fluxo nativo iOS: usa ASAuthorizationAppleIDProvider via plugin
        const result: SignInWithAppleResponse = await SignInWithApple.authorize({
          clientId: 'br.com.mcconsultoriati.estudae',
          redirectURI: 'https://ndxphrglwwdftripdcjm.supabase.co/auth/v1/callback',
          scopes: 'email name',
          nonce: hashedNonce,
        });

        const identityToken = result.response?.identityToken;
        if (!identityToken) {
          return { error: "Apple não retornou um token de identidade." };
        }

        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: identityToken,
          nonce: rawNonce,
        });

        if (error) {
          console.error('[Auth] Apple ID token error:', error.message);
          return { error: `Apple: ${error.message}` };
        }

        return { error: null };
      }

      // Web (e Android): fluxo OAuth padrão
      const redirectTo = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: { redirectTo },
      });

      if (error) {
        console.error('[Auth] Apple OAuth error:', error.message);
        return { error: "Erro ao conectar com Apple. Tente novamente." };
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'erro desconhecido';
      console.error('[Auth] Apple sign in catch:', err);
      // Usuário cancelou - não mostra erro
      if (message.toLowerCase().includes('cancel') || message.includes('1001')) {
        return { error: null };
      }
      return { error: `Apple: ${message}` };
    }
  };

  const deleteAccount = async (): Promise<{ error: string | null }> => {
    try {
      // Deleta todos os dados do usuário (cascade no banco via FK)
      // Depois faz signOut - a conta será removida pelo Supabase admin
      const userId = user?.id;
      if (!userId) return { error: "Usuário não encontrado." };

      // Deleta dados na ordem correta (dependências primeiro)
      await supabase.from("planner_blocks").delete().eq("user_id", userId);
      await supabase.from("subject_notes").delete().eq("user_id", userId);
      await supabase.from("study_sessions").delete().eq("user_id", userId);
      await supabase.from("subjects").delete().eq("user_id", userId);
      await supabase.from("profiles").delete().eq("id", userId);

      // Signout
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);

      return { error: null };
    } catch (err) {
      console.error('[Auth] Delete account error:', err);
      return { error: "Erro ao excluir conta. Tente novamente." };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
