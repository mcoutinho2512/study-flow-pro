---
title: "StudyFlow - Relatorio Tecnico Completo"
subtitle: "Base de Conhecimento para Manutencao e Evolucao"
author: "MC Tech Consultoria e Servicos"
date: "Marco 2026"
---

# STUDYFLOW - RELATORIO TECNICO COMPLETO

**Versao:** 1.0.0
**Data:** Marco de 2026
**Empresa:** MC Tech Consultoria e Servicos
**Desenvolvedor:** Magnun Coutinho
**Status:** Em revisao na Apple App Store

---

# 1. VISAO GERAL DO PROJETO

O **StudyFlow** e um aplicativo multiplataforma de planejamento e acompanhamento de estudos. Foi projetado para estudantes de concursos, vestibulares, faculdade e certificacoes que precisam organizar sua rotina de estudos com disciplina e foco.

O app combina as funcionalidades de planner semanal, timer Pomodoro, gerenciamento de materias, anotacoes e relatorios de progresso em uma unica interface moderna e intuitiva.

## 1.1 Funcionalidades Principais

| Funcionalidade | Descricao |
|---------------|-----------|
| Dashboard | Visao geral do dia com sessoes, streak e progresso |
| Planner Semanal | Grade visual seg-dom com blocos de estudo |
| Modo Foco (Pomodoro) | Timer configuravel com registro automatico |
| Materias | Cadastro com cores e estatisticas por disciplina |
| Anotacoes | Topicos de atencao vinculados a cada materia |
| Relatorios | Graficos de horas, distribuicao e metas |
| Configuracoes | Metas, timer, tema e notificacoes |

## 1.2 Plataformas

- **Web:** Navegadores modernos (Chrome, Safari, Firefox)
- **iOS:** iPhone (via Capacitor)
- **Android:** Smartphones Android (via Capacitor)
- **PWA:** Progressive Web App com manifest

---

# 2. STACK TECNOLOGICA

## 2.1 Frontend

| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| React | 18.3.1 | Framework de UI |
| TypeScript | 5.8.3 | Tipagem estatica |
| Vite | 8.0.0 | Build tool e dev server |
| React Router | 6.30.1 | Roteamento SPA |
| TanStack React Query | 5.83.0 | Cache e estado do servidor |
| Tailwind CSS | 3.4.17 | Estilizacao utility-first |
| Framer Motion | 12.38.0 | Animacoes |
| Recharts | 2.15.4 | Graficos e charts |
| Lucide React | 0.462.0 | Icones |
| Sonner | 1.7.4 | Notificacoes toast |
| date-fns | 3.6.0 | Manipulacao de datas |

## 2.2 Backend e Banco de Dados

| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| Supabase | 2.99.2 | BaaS (Backend as a Service) |
| PostgreSQL | 14.x | Banco de dados (via Supabase) |
| Row Level Security | - | Isolamento de dados por usuario |

## 2.3 Mobile

| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| Capacitor Core | 8.2.0 | Bridge nativo |
| Capacitor iOS | 8.2.0 | Build iOS |
| Capacitor Android | 8.2.0 | Build Android |
| @capacitor/app | 8.0.1 | Deep links |
| @capacitor/browser | 8.0.2 | Browser externo |
| @capacitor/splash-screen | 8.0.1 | Tela de abertura |
| @capacitor/status-bar | 8.0.1 | Barra de status |
| @capacitor/keyboard | 8.0.1 | Teclado nativo |
| @capacitor/haptics | 8.0.1 | Feedback tatil |

## 2.4 UI Components

| Tecnologia | Funcao |
|-----------|--------|
| shadcn/ui | Biblioteca de componentes |
| Radix UI | Primitivos acessiveis |
| React Hook Form | Gerenciamento de formularios |
| Zod | Validacao de schemas |

## 2.5 Testes

| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| Vitest | 4.1.0 | Testes unitarios |
| Playwright | 1.57.0 | Testes E2E |
| Testing Library | 16.0.0 | Testes de componente |

---

# 3. ARQUITETURA DO PROJETO

## 3.1 Estrutura de Pastas

```
src/
|-- App.tsx                    # Roteamento principal
|-- main.tsx                   # Entry point React
|-- index.css                  # Estilos globais + variaveis CSS
|-- contexts/
|   |-- AuthContext.tsx         # Estado global de autenticacao
|-- pages/
|   |-- Dashboard.tsx          # Tela inicial (106 linhas)
|   |-- Auth.tsx               # Login/cadastro (210 linhas)
|   |-- WeeklyPlanner.tsx      # Planner semanal (685 linhas)
|   |-- FocusMode.tsx          # Timer Pomodoro (296 linhas)
|   |-- SettingsPage.tsx       # Configuracoes (319 linhas)
|   |-- Analytics.tsx          # Relatorios (107 linhas)
|   |-- Subjects.tsx           # Materias/anotacoes (337 linhas)
|   |-- NotFound.tsx           # Pagina 404 (24 linhas)
|   |-- Index.tsx              # Re-export Dashboard
|-- hooks/
|   |-- useAnalytics.ts        # Calculos de analytics (148 linhas)
|   |-- useStudySessions.ts    # CRUD sessoes (122 linhas)
|   |-- useSubjects.ts         # CRUD materias (114 linhas)
|   |-- usePlannerBlocks.ts    # CRUD planner (205 linhas)
|   |-- useSubjectNotes.ts     # CRUD anotacoes (101 linhas)
|   |-- useProfile.ts          # Perfil usuario (77 linhas)
|   |-- use-toast.ts           # Hook de toast (186 linhas)
|   |-- use-mobile.tsx         # Deteccao mobile (19 linhas)
|-- components/
|   |-- layout/
|   |   |-- AppLayout.tsx      # Layout com navegacao (59 linhas)
|   |-- ErrorBoundary.tsx      # Error boundary (45 linhas)
|   |-- ProtectedRoute.tsx     # Guard de autenticacao (21 linhas)
|   |-- ProgressRing.tsx       # Anel de progresso SVG (55 linhas)
|   |-- StatCard.tsx           # Card de estatistica (32 linhas)
|   |-- StudyCard.tsx          # Card de sessao (67 linhas)
|   |-- SubjectBadge.tsx       # Badge de materia (43 linhas)
|   |-- NavLink.tsx            # Link de navegacao (28 linhas)
|   |-- ui/                    # 48 componentes shadcn/ui
|-- integrations/
|   |-- supabase/
|       |-- client.ts          # Cliente Supabase
|       |-- types.ts           # Tipos gerados do banco
|-- lib/
    |-- utils.ts               # Funcao cn() para classes
```

## 3.2 Fluxo de Dados

```
Usuario -> Pagina -> Hook (React Query) -> Supabase Client -> PostgreSQL
                                                   |
                                              RLS Policy
                                           (filtra por user_id)
```

1. Usuario interage com a interface (pagina)
2. Pagina chama hook customizado (useSubjects, usePlannerBlocks, etc.)
3. Hook usa React Query para cache e estado do servidor
4. React Query chama Supabase Client (SDK JavaScript)
5. Supabase aplica Row Level Security (RLS) para isolamento
6. Dados retornam e sao cacheados por 5 minutos
7. Mutacoes invalidam cache relevante automaticamente

## 3.3 Roteamento

```
/auth              -> Auth.tsx (publica)
/                  -> Dashboard.tsx (protegida)
/subjects          -> Subjects.tsx (protegida)
/planner           -> WeeklyPlanner.tsx (protegida)
/focus             -> FocusMode.tsx (protegida)
/analytics         -> Analytics.tsx (protegida)
/settings          -> SettingsPage.tsx (protegida)
*                  -> NotFound.tsx
```

Todas as rotas exceto `/auth` sao protegidas pelo componente `ProtectedRoute` que verifica a sessao do Supabase.

## 3.4 Navegacao

Barra de navegacao inferior fixa com 6 itens:

| Icone | Label | Rota |
|-------|-------|------|
| LayoutDashboard | Inicio | / |
| BookOpen | Materias | /subjects |
| CalendarDays | Planner | /planner |
| Timer | Foco | /focus |
| BarChart3 | Relatorios | /analytics |
| Settings | Config | /settings |

---

# 4. BANCO DE DADOS

## 4.1 Diagrama de Tabelas

```
auth.users (Supabase gerenciado)
    |
    |-- 1:1 --> profiles
    |-- 1:N --> subjects
    |               |-- 1:N --> subject_notes
    |               |-- 1:N --> study_sessions
    |               |-- 1:N --> planner_blocks
    |-- 1:N --> study_sessions
    |-- 1:N --> planner_blocks
```

## 4.2 Tabela: profiles

Criada automaticamente via trigger quando um usuario se cadastra.

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| id | UUID (PK) | FK auth.users | ID do usuario |
| full_name | TEXT | NULL | Nome completo |
| avatar_url | TEXT | NULL | URL da foto (Google) |
| daily_goal_hours | NUMERIC(4,1) | 4.0 | Meta diaria em horas |
| weekly_goal_hours | NUMERIC(5,1) | 25.0 | Meta semanal em horas |
| monthly_goal_hours | NUMERIC(6,1) | 120.0 | Meta mensal em horas |
| focus_duration_minutes | INTEGER | 25 | Duracao foco Pomodoro |
| break_duration_minutes | INTEGER | 5 | Duracao intervalo |
| created_at | TIMESTAMPTZ | now() | Data de criacao |
| updated_at | TIMESTAMPTZ | now() | Ultima atualizacao |

**Constraints:** daily_goal 0.5-24h, weekly 1-168h, monthly 1-744h, focus 5-120min, break 1-30min, full_name max 100 chars.

## 4.3 Tabela: subjects

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| id | UUID (PK) | gen_random_uuid() | ID da materia |
| user_id | UUID (FK) | NOT NULL | Dono da materia |
| name | TEXT | NOT NULL | Nome (1-50 chars) |
| color | TEXT | 'indigo' | Cor visual |
| is_archived | BOOLEAN | false | Soft delete |
| created_at | TIMESTAMPTZ | now() | Criacao |
| updated_at | TIMESTAMPTZ | now() | Atualizacao |

**Cores validas:** indigo, emerald, amber, sky, rose, violet
**Constraint unica:** (user_id, name) - nao pode repetir nome por usuario.

## 4.4 Tabela: study_sessions

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| id | UUID (PK) | gen_random_uuid() | ID da sessao |
| user_id | UUID (FK) | NOT NULL | Dono |
| subject_id | UUID (FK) | NOT NULL | Materia vinculada |
| type | TEXT | 'focus' | Tipo: focus ou break |
| started_at | TIMESTAMPTZ | NOT NULL | Inicio da sessao |
| ended_at | TIMESTAMPTZ | NULL | Fim (preenchido ao finalizar) |
| duration_seconds | INTEGER | NULL | Duracao calculada |
| created_at | TIMESTAMPTZ | now() | Registro |

**Constraints:** type IN ('focus', 'break'), duration >= 0, ended_at >= started_at.

## 4.5 Tabela: subject_notes

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| id | UUID (PK) | gen_random_uuid() | ID da nota |
| user_id | UUID (FK) | NOT NULL | Dono |
| subject_id | UUID (FK) | NOT NULL | Materia vinculada |
| title | TEXT | NOT NULL | Titulo (1-100 chars) |
| content | TEXT | '' | Conteudo (0-5000 chars) |
| created_at | TIMESTAMPTZ | now() | Criacao |
| updated_at | TIMESTAMPTZ | now() | Atualizacao |

## 4.6 Tabela: planner_blocks

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| id | UUID (PK) | gen_random_uuid() | ID do bloco |
| user_id | UUID (FK) | NOT NULL | Dono |
| subject_id | UUID (FK) | NULL | Materia (opcional) |
| title | TEXT | NOT NULL | Titulo (1-100 chars) |
| day_of_week | INTEGER | NOT NULL | 0=Seg, 6=Dom |
| start_time | TIME | NOT NULL | Hora inicio |
| end_time | TIME | NOT NULL | Hora fim |
| duration_minutes | INTEGER | NOT NULL | Duracao (1-480min) |
| color | TEXT | 'indigo' | Cor visual |
| session_type | TEXT | 'estudo' | Tipo da sessao |
| notes | TEXT | NULL | Observacoes (0-1000) |
| status | TEXT | 'planned' | Estado do bloco |
| created_at | TIMESTAMPTZ | now() | Criacao |
| updated_at | TIMESTAMPTZ | now() | Atualizacao |

**Tipos de sessao:** estudo, revisao, exercicio, leitura
**Status:** planned, in_progress, completed, missed

## 4.7 Seguranca (RLS)

Todas as tabelas possuem Row Level Security habilitado com politicas identicas:

- **SELECT:** `auth.uid() = user_id`
- **INSERT:** `auth.uid() = user_id`
- **UPDATE:** `auth.uid() = user_id`
- **DELETE:** `auth.uid() = user_id`

Isso garante que cada usuario so acessa seus proprios dados.

## 4.8 Triggers

| Trigger | Tabela | Funcao |
|---------|--------|--------|
| on_auth_user_created | auth.users | Auto-cria profile com nome e avatar |
| set_profiles_updated_at | profiles | Atualiza updated_at |
| set_subjects_updated_at | subjects | Atualiza updated_at |
| set_notes_updated_at | subject_notes | Atualiza updated_at |
| set_planner_blocks_updated_at | planner_blocks | Atualiza updated_at |

## 4.9 Indexes

| Index | Tabela | Colunas |
|-------|--------|---------|
| idx_subjects_user_id | subjects | user_id |
| idx_sessions_user_started | study_sessions | user_id, started_at |
| idx_sessions_subject | study_sessions | subject_id |
| idx_sessions_user_type_started | study_sessions | user_id, type, started_at |
| idx_subjects_user_archived | subjects | user_id, is_archived |
| idx_notes_subject | subject_notes | subject_id |
| idx_notes_user | subject_notes | user_id |
| idx_planner_user | planner_blocks | user_id |
| idx_planner_user_day | planner_blocks | user_id, day_of_week |
| idx_planner_subject | planner_blocks | subject_id |

---

# 5. AUTENTICACAO

## 5.1 Metodos de Login

| Metodo | Descricao |
|--------|-----------|
| Email/Senha | Cadastro com confirmacao por email, login com credenciais |
| Google OAuth | Login via conta Google (web e mobile) |

## 5.2 Fluxo de Autenticacao

```
1. Usuario acessa /auth
2. Preenche email/senha ou clica "Continuar com Google"
3. Supabase Auth valida credenciais
4. Sessao criada e armazenada no localStorage
5. AuthContext atualiza estado (user, session)
6. ProtectedRoute libera acesso as rotas
7. Profile auto-criado via trigger no banco
```

## 5.3 Seguranca de Autenticacao

- **Rate limiting:** 5 tentativas + lockout de 10 minutos
- **Cooldown:** 2 segundos entre tentativas
- **Senha minima:** 8 caracteres
- **Email:** Validacao com regex
- **Nome:** Maximo 100 caracteres
- **Erros sanitizados:** Mensagens genericas em portugues
- **Auto-refresh:** Token renovado automaticamente
- **Mobile OAuth:** Deep link com URL scheme `com.studyflow.app://login`

---

# 6. DETALHAMENTO DAS TELAS

## 6.1 Dashboard (/)

A tela inicial exibe:

- Saudacao com data do dia
- Contagem de sessoes de hoje
- Card de streak (dias seguidos estudando)
- Card de horas estudadas hoje
- Progresso semanal com barra por dia
- Lista de sessoes do dia com horarios
- Botao "Iniciar Foco" se nao houver sessoes

**Hooks utilizados:** useTodaySessions, useGoalProgress, useStreak

## 6.2 Planner Semanal (/planner)

Grade visual com:

- **Visao Semana:** Colunas seg-dom, linhas 06:00-22:00
- **Visao Dia:** Timeline vertical do dia selecionado
- **Blocos coloridos** posicionados por horario e duracao
- **Criar bloco:** Dialog com materia, dia, horario, tipo, cor, observacao
- **Editar bloco:** Dialog com opcoes de alterar ou excluir
- **Status visual:** Indicador de cor por estado (planejado/concluido/perdido)
- **Scroll horizontal** para dias + scroll vertical para horarios
- **Cabecalho sticky** com dias da semana

**Hooks utilizados:** usePlannerBlocks, useSubjects

## 6.3 Modo Foco (/focus)

Timer Pomodoro com:

- **Timer circular SVG** com animacao suave
- **Fases:** Foco (padrao 25min) -> Intervalo (padrao 5min) -> Foco...
- **Seletor de materia** (apenas quando pausado)
- **Controles:** Play/Pause, Reset, Completar sessao
- **Contador de sessoes:** Ate 4 sessoes por ciclo
- **Salvamento automatico** ao completar com retry (3 tentativas)
- **Background handling:** Compensa tempo em segundo plano
- **Precisao:** Usa requestAnimationFrame + Date.now()

**Hooks utilizados:** useSubjects, useProfile, useCreateSession, useUpdateSession

## 6.4 Materias (/subjects)

Duas visoes:

**1. Lista de Materias:**
- Grid 2 colunas com SubjectBadge
- Cada badge mostra: nome, cor, sessoes, horas
- Botao adicionar materia (dialog com nome + cor)
- Botao deletar (soft delete / archive)

**2. Anotacoes da Materia:**
- Lista de notas vinculadas a materia selecionada
- Criar nota com titulo e conteudo
- Editar e excluir notas existentes
- Botao voltar para lista de materias

**Hooks utilizados:** useSubjects, useSubjectNotes, useStudySessions

## 6.5 Relatorios (/analytics)

Dashboard analitico com:

- **4 StatCards:** Total horas, Streak, % meta diaria, Qtd sessoes
- **Grafico de barras:** Horas por dia da semana (Recharts)
- **Distribuicao por materia:** Barras coloridas com % e horas
- **3 ProgressRings:** Meta semanal, mensal e diaria

**Hooks utilizados:** useWeeklyAnalytics, useGoalProgress, useStreak

## 6.6 Configuracoes (/settings)

- **Perfil:** Avatar, nome e email do usuario
- **Metas:** Dialog com inputs para metas diaria/semanal/mensal
- **Timer:** Dialog com duracao de foco e intervalo
- **Notificacoes:** Toggles para lembrete, fim de sessao, resumo semanal
- **Aparencia:** Selector de tema (claro/escuro/automatico)
- **Sair:** Botao de logout

**Hooks utilizados:** useAuth, useProfile, useUpdateProfile

---

# 7. HOOKS DE DADOS

## 7.1 Padrao de Implementacao

Todos os hooks seguem o mesmo padrao:

```typescript
// Query (leitura)
export function useExemplo() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["exemplo", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tabela")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Mutation (escrita)
export function useCreateExemplo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dados) => {
      // Validacoes
      const { data, error } = await supabase
        .from("tabela")
        .insert({ user_id: user!.id, ...dados })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exemplo"] });
    },
  });
}
```

## 7.2 Configuracao do React Query

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutos
      gcTime: 1000 * 60 * 30,         // 30 minutos
      retry: 1,                        // 1 retry
      refetchOnWindowFocus: false,     // Nao refetch ao focar
    },
  },
});
```

---

# 8. DESIGN SYSTEM

## 8.1 Paleta de Cores

| Nome | Valor HSL | Uso |
|------|----------|-----|
| Primary | hsl(243, 75%, 59%) | Acoes principais, botoes, links |
| Accent | hsl(142, 71%, 45%) | Sucesso, intervalos, confirmacoes |
| Destructive | hsl(0, 84%, 60%) | Erros, exclusoes, perigo |
| Background | hsl(0, 0%, 98%) | Fundo geral (light) |
| Foreground | hsl(222, 47%, 11%) | Texto principal |
| Muted | hsl(220, 14%, 96%) | Elementos secundarios |
| Card | hsl(0, 0%, 100%) | Fundo de cards |

### Cores de Materias

| Cor | Background | Texto | Uso |
|-----|-----------|-------|-----|
| indigo | bg-indigo-500 | text-indigo-700 | Padrao |
| emerald | bg-emerald-500 | text-emerald-700 | - |
| amber | bg-amber-500 | text-amber-700 | - |
| sky | bg-sky-500 | text-sky-700 | - |
| rose | bg-rose-500 | text-rose-700 | - |
| violet | bg-violet-500 | text-violet-700 | - |

## 8.2 Tipografia

- **Familia:** Inter (Google Fonts)
- **Fallback:** system-ui, sans-serif
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Tamanhos comuns:** text-xs (9px labels), text-sm, text-base, text-2xl, text-3xl

## 8.3 Espacamentos e Bordas

- **Border radius:** 0.75rem (12px) padrao, com variantes sm/md/lg/xl/2xl
- **Sombras:** shadow-card (suave), shadow-card-hover (medio), shadow-elevated (forte)
- **Transicao padrao:** 200ms cubic-bezier(0.4, 0, 0.2, 1)

## 8.4 Modo Escuro

O app suporta tres modos de tema:

- **Claro:** Fundo branco, textos escuros
- **Escuro:** Fundo hsl(240, 10%, 3.9%), textos claros
- **Automatico:** Segue preferencia do sistema operacional

Implementado via classe CSS `.dark` no elemento raiz + variaveis CSS.

---

# 9. CONFIGURACAO MOBILE (CAPACITOR)

## 9.1 Identificacao do App

| Campo | Valor |
|-------|-------|
| App ID | com.studyflow.app (dev) / br.com.mcconsultoriati.studyflow (prod) |
| App Name | StudyFlow |
| Web Directory | dist |
| Android Scheme | https |

## 9.2 Plugins Configurados

| Plugin | Configuracao |
|--------|-------------|
| SplashScreen | 2s duracao, fundo branco, auto-hide |
| StatusBar | Style Light, overlay WebView |
| Keyboard | Resize body, fullscreen |

## 9.3 iOS Specifics

- **URL Scheme:** com.studyflow.app (para deep links OAuth)
- **Safe Areas:** Tratamento de notch e home indicator via CSS env()
- **Orientacoes:** Portrait (principal), Landscape (suportado)
- **Status Bar:** Overlay com fundo do app, icones brancos

## 9.4 Scripts de Build

```bash
# Desenvolvimento
npm run dev

# Build producao + sync iOS
npm run build && npx cap sync ios

# Abrir no Xcode
npx cap open ios

# Build producao + sync Android
npm run build && npx cap sync android

# Abrir no Android Studio
npx cap open android

# Gerar assets (icones e splash)
npx capacitor-assets generate --iconBackgroundColor '#6C63FF' --splashBackgroundColor '#FFFFFF'
```

---

# 10. SEGURANCA

## 10.1 Medidas Implementadas

| Area | Medida |
|------|--------|
| Banco | RLS em todas as tabelas |
| Banco | Constraints de validacao em todos os campos |
| Auth | Rate limiting (5 tentativas + 10min lockout) |
| Auth | Sanitizacao de mensagens de erro |
| Auth | Senha minima 8 caracteres |
| Auth | Validacao de email com regex |
| Frontend | ErrorBoundary para crashes |
| Frontend | Validacao de inputs nos hooks |
| HTML | X-Frame-Options: DENY |
| HTML | X-Content-Type-Options: nosniff |
| HTML | Referrer-Policy: strict-origin |
| Git | .env fora do versionamento |
| Git | .env.example como template |

## 10.2 Variaveis de Ambiente

```bash
# .env (NAO versionado)
VITE_SUPABASE_PROJECT_ID="xxx"
VITE_SUPABASE_PUBLISHABLE_KEY="xxx"
VITE_SUPABASE_URL="https://xxx.supabase.co"
```

Apenas chaves publicas (publishable key). A service_role key NUNCA e exposta no frontend.

---

# 11. DEPLOY E INFRAESTRUTURA

## 11.1 Web (VPS com Nginx)

- **Dominio:** planejamento.estudante.mcconsultoriati.com.br
- **Servidor:** VPS com Nginx
- **SSL:** Certbot (Let's Encrypt)
- **Arquivos:** Conteudo da pasta `dist/` copiado para `/var/www/studyflow/`

**Configuracao Nginx:**
```nginx
server {
    server_name planejamento.estudante.mcconsultoriati.com.br;
    root /var/www/studyflow;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
}
```

## 11.2 iOS (App Store)

- **Bundle ID:** br.com.mcconsultoriati.studyflow
- **Status:** Em revisao na Apple (submetido em marco 2026)
- **Signing:** Automatico via conta Apple Developer
- **Archive:** Gerado no Xcode e uploaded via App Store Connect

## 11.3 Backend (Supabase)

- **Projeto:** ndxphrglwwdftripdcjm
- **URL:** https://ndxphrglwwdftripdcjm.supabase.co
- **Regiao:** West US (Oregon)
- **Plano:** Free tier
- **Auth Providers:** Email/Password + Google OAuth

---

# 12. MIGRATIONS (Historico de Evolucao do Banco)

## Migration 001 - Schema Inicial
- Tabelas: profiles, subjects, study_sessions
- Indexes, RLS, triggers de auto-criacao e updated_at

## Migration 002 - Constraints de Seguranca
- CHECK constraints em ranges numericos
- Validacao de cores, tamanhos de texto

## Migration 003 - Anotacoes por Materia
- Tabela subject_notes
- Constraints de titulo e conteudo
- RLS e trigger de updated_at

## Migration 004 - Planner Semanal
- Tabela planner_blocks
- Constraints de dia, horario, duracao, tipo, status
- Indexes compostos para performance
- RLS e trigger de updated_at

---

# 13. CONTAGEM DE CODIGO

| Categoria | Arquivos | Linhas |
|-----------|----------|--------|
| Paginas | 9 | 2.086 |
| Hooks | 8 | 972 |
| Componentes custom | 8 | 350 |
| Contextos | 1 | 166 |
| Componentes UI (shadcn) | 48 | ~4.800 |
| Migrations SQL | 4 | 299 |
| Config (vite, tailwind, etc) | 5 | ~280 |
| **TOTAL** | **83** | **~8.953** |

---

# 14. GUIA DE MANUTENCAO

## 14.1 Ambiente de Desenvolvimento

```bash
# Clonar repositorio
git clone git@github.com:mcoutinho2512/study-flow-pro.git
cd study-flow-pro

# Instalar dependencias
npm install

# Criar .env a partir do exemplo
cp .env.example .env
# Editar .env com credenciais do Supabase

# Iniciar servidor de desenvolvimento
npm run dev
# Abre em http://localhost:8080
```

## 14.2 Adicionar Nova Funcionalidade

1. Criar migration SQL se precisar de nova tabela
2. Rodar migration no Supabase SQL Editor
3. Atualizar types.ts com os novos tipos
4. Criar hook em src/hooks/
5. Criar pagina em src/pages/
6. Adicionar rota em src/App.tsx
7. Adicionar item na navegacao em AppLayout.tsx
8. Testar localmente
9. Build e sync: `npm run build && npx cap sync ios`
10. Testar no dispositivo

## 14.3 Deploy de Atualizacao

**Web:**
```bash
npm run build
# Copiar dist/ para o servidor via SCP/rsync
```

**iOS:**
```bash
npm run build && npx cap sync ios && npx cap open ios
# No Xcode: Product > Archive > Distribute > App Store Connect
```

**Banco:**
```sql
-- Rodar novas migrations no Supabase SQL Editor
-- Sempre DEPOIS das anteriores e na ordem numerica
```

## 14.4 Troubleshooting Comum

| Problema | Solucao |
|----------|---------|
| OAuth Google nao funciona | Verificar Redirect URLs no Supabase e Google Cloud |
| Splash cortada no iOS | Imagem deve ser 1290x2796, usar scaleAspectFill |
| Status bar invisivel | StatusBar style deve ser Light (icones brancos) |
| Build falha no Xcode | Cmd+Shift+K (clean) e retentar |
| Dados nao aparecem | Verificar se migration foi rodada e RLS esta correto |
| npm install falha | Usar --legacy-peer-deps |

---

# 15. EVOLUCOES FUTURAS SUGERIDAS

| Prioridade | Funcionalidade | Descricao |
|-----------|----------------|-----------|
| Alta | Google Play Store | Publicar versao Android |
| Alta | Notificacoes push | Lembretes reais via push notification |
| Media | Modo offline | Service workers + sync quando reconectar |
| Media | Drag and drop | Mover blocos no planner arrastando |
| Media | Exportar dados | PDF/CSV com relatorios de estudo |
| Baixa | Compartilhamento | Compartilhar progresso em redes sociais |
| Baixa | Templates | Rotinas pre-definidas de estudo |
| Baixa | Gamificacao | Badges e conquistas por metas atingidas |
| Baixa | Calendario Google | Integracao com Google Calendar |

---

# 16. CONTATOS E ACESSOS

| Recurso | Acesso |
|---------|--------|
| Repositorio | github.com/mcoutinho2512/study-flow-pro |
| Supabase | supabase.com (projeto ndxphrglwwdftripdcjm) |
| App Store Connect | appstoreconnect.apple.com |
| Google Cloud Console | console.cloud.google.com (OAuth) |
| Dominio Web | planejamento.estudante.mcconsultoriati.com.br |
| VPS | 69.6.250.114 |
| Conta Developer Apple | developer.apple.com |

---

*Documento gerado em Marco de 2026*
*MC Tech Consultoria e Servicos*
*Todos os direitos reservados*
