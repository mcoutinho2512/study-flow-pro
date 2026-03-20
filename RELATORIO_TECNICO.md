# StudyFlow Pro - Relatorio Tecnico Completo

**Data:** 20/03/2026
**Versao:** 1.0.0
**Status:** MVP pronto para producao
**Repositorio:** github.com/mcoutinho2512/study-flow-pro

---

## 1. Visao Geral do Projeto

O **StudyFlow** e um aplicativo de planejamento de estudos que permite ao usuario organizar suas materias, cronometrar sessoes de estudo com a tecnica Pomodoro, acompanhar progresso com metas e visualizar relatorios de desempenho.

**Plataformas alvo:**
- Web (hospedado em https://planejamento.estudante.mcconsultoriati.com.br)
- iOS (App Store via Capacitor)
- Android (Google Play via Capacitor)

**Idioma:** Portugues Brasileiro (pt-BR)

---

## 2. Stack Tecnologica

### Frontend
| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| React | 18.3.1 | Biblioteca UI |
| TypeScript | 5.8.3 | Tipagem estatica |
| Vite | 8.0.0 | Build tool e dev server |
| React Router DOM | 6.30.1 | Roteamento SPA |
| TailwindCSS | 3.4.17 | Framework CSS utility-first |
| shadcn/ui (Radix UI) | - | Componentes acessiveis |
| Framer Motion | 12.38.0 | Animacoes |
| Recharts | 2.15.4 | Graficos e visualizacoes |
| Lucide React | 0.462.0 | Icones |

### Backend e Banco de Dados
| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| Supabase | 2.99.2 | Backend-as-a-Service (PostgreSQL + Auth) |
| React Query | 5.83.0 | Gerenciamento de estado do servidor |

### Mobile
| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| Capacitor Core | 8.2.0 | Bridge web-to-native |
| Capacitor CLI | 8.2.0 | Ferramentas de build |
| Capacitor iOS | 8.2.0 | Plataforma iOS |
| Capacitor Android | 8.2.0 | Plataforma Android |
| Capacitor App | 8.0.1 | Deep links e lifecycle |
| Capacitor Status Bar | 8.0.1 | Controle da status bar |
| Capacitor Splash Screen | 8.0.1 | Tela de abertura |
| Capacitor Keyboard | 8.0.1 | Comportamento do teclado |
| Capacitor Haptics | 8.0.1 | Feedback tatil |

### Formularios e Validacao
| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| React Hook Form | 7.61.1 | Gerenciamento de formularios |
| Zod | 3.25.76 | Validacao de schemas |
| date-fns | 3.6.0 | Manipulacao de datas |

### Testes
| Tecnologia | Versao | Funcao |
|-----------|--------|--------|
| Vitest | 4.1.0 | Testes unitarios |
| Testing Library | 16.0.0 | Testes de componentes |
| Playwright | 1.57.0 | Testes E2E |

---

## 3. Arquitetura do Projeto

```
app-plano-estudo/
├── src/
│   ├── App.tsx                          # Roteamento principal + providers
│   ├── main.tsx                         # Entry point React
│   ├── index.css                        # Estilos globais + tema + safe areas
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx              # Provider de autenticacao global
│   │
│   ├── pages/
│   │   ├── Auth.tsx                     # Login / Signup / Google OAuth
│   │   ├── Dashboard.tsx                # Tela inicial (sessoes de hoje)
│   │   ├── Subjects.tsx                 # CRUD de materias
│   │   ├── FocusMode.tsx                # Timer Pomodoro
│   │   ├── Analytics.tsx                # Relatorios e graficos
│   │   ├── SettingsPage.tsx             # Configuracoes do usuario
│   │   ├── Index.tsx                    # Redirect para Dashboard
│   │   └── NotFound.tsx                 # Pagina 404
│   │
│   ├── components/
│   │   ├── ProtectedRoute.tsx           # Guarda de rotas autenticadas
│   │   ├── StudyCard.tsx                # Card de sessao de estudo
│   │   ├── StatCard.tsx                 # Card de estatistica
│   │   ├── ProgressRing.tsx             # Anel de progresso circular (SVG)
│   │   ├── SubjectBadge.tsx             # Badge de materia com cor
│   │   ├── NavLink.tsx                  # Link de navegacao
│   │   ├── layout/
│   │   │   └── AppLayout.tsx            # Layout com nav bottom
│   │   └── ui/                          # ~50 componentes shadcn/ui
│   │
│   ├── hooks/
│   │   ├── useProfile.ts               # Perfil e metas do usuario
│   │   ├── useSubjects.ts              # CRUD de materias
│   │   ├── useStudySessions.ts          # Sessoes de estudo + filtros
│   │   ├── useAnalytics.ts             # Calculos de analytics e streak
│   │   ├── use-mobile.tsx              # Deteccao de dispositivo movel
│   │   └── use-toast.ts               # Notificacoes toast
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts               # Cliente Supabase configurado
│   │       └── types.ts                # Tipos TypeScript do banco
│   │
│   └── lib/
│       └── utils.ts                    # Utilitarios (cn helper)
│
├── supabase/
│   ├── config.toml                     # Configuracao do projeto Supabase
│   └── migrations/
│       └── 001_initial_schema.sql      # Schema completo do banco
│
├── assets/                             # Imagens fonte para gerar icones
│   ├── icon-only.png                   # Icone principal (1024x1024)
│   ├── icon-foreground.png             # Foreground Android adaptive
│   ├── icon-background.png             # Background Android adaptive
│   ├── splash.png                      # Splash screen (2732x2732)
│   └── feature-graphic.png            # Banner Google Play (1024x500)
│
├── icons/                              # Icones PWA gerados
├── ios/                                # Projeto nativo iOS (gitignored)
├── android/                            # Projeto nativo Android (gitignored)
│
├── capacitor.config.ts                 # Configuracao Capacitor
├── vite.config.ts                      # Configuracao Vite
├── tailwind.config.ts                  # Configuracao Tailwind
├── tsconfig.json                       # Configuracao TypeScript
├── package.json                        # Dependencias e scripts
├── .env                                # Variaveis de ambiente
├── index.html                          # HTML raiz
├── GUIA_DEPLOY.md                      # Guia passo-a-passo de deploy
└── RELATORIO_TECNICO.md                # Este documento
```

---

## 4. Banco de Dados

**Provedor:** Supabase (PostgreSQL gerenciado)
**Projeto:** ndxphrglwwdftripdcjm
**URL:** https://ndxphrglwwdftripdcjm.supabase.co

### 4.1 Tabelas

#### profiles
Armazena dados do usuario e suas preferencias. Criada automaticamente no signup via trigger.

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| id | UUID (PK) | FK auth.users | ID do usuario |
| full_name | TEXT | null | Nome completo |
| avatar_url | TEXT | null | URL da foto (Google) |
| daily_goal_hours | NUMERIC(4,1) | 4.0 | Meta diaria em horas |
| weekly_goal_hours | NUMERIC(5,1) | 25.0 | Meta semanal em horas |
| monthly_goal_hours | NUMERIC(6,1) | 120.0 | Meta mensal em horas |
| focus_duration_minutes | INT | 25 | Duracao foco Pomodoro |
| break_duration_minutes | INT | 5 | Duracao intervalo |
| created_at | TIMESTAMPTZ | now() | Data de criacao |
| updated_at | TIMESTAMPTZ | now() | Auto-atualizado via trigger |

#### subjects
Materias/disciplinas de estudo do usuario.

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| id | UUID (PK) | gen_random_uuid() | ID da materia |
| user_id | UUID (FK) | - | Dono da materia |
| name | TEXT | - | Nome (unico por usuario) |
| color | TEXT | 'indigo' | Cor do badge |
| is_archived | BOOLEAN | false | Soft delete |
| created_at | TIMESTAMPTZ | now() | Data de criacao |
| updated_at | TIMESTAMPTZ | now() | Auto-atualizado via trigger |

**Cores disponiveis:** indigo, emerald, amber, sky, rose, violet

#### study_sessions
Registro de cada sessao de estudo realizada.

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| id | UUID (PK) | gen_random_uuid() | ID da sessao |
| user_id | UUID (FK) | - | Dono da sessao |
| subject_id | UUID (FK) | - | Materia estudada |
| type | TEXT | 'focus' | 'focus' ou 'break' |
| started_at | TIMESTAMPTZ | - | Inicio da sessao |
| ended_at | TIMESTAMPTZ | null | Fim (null = em andamento) |
| duration_seconds | INT | null | Duracao calculada |
| created_at | TIMESTAMPTZ | now() | Data do registro |

### 4.2 Indexes
- `idx_subjects_user_id` - Listagem de materias por usuario
- `idx_sessions_user_started` - Consulta de sessoes por periodo
- `idx_sessions_subject` - Agregacao por materia

### 4.3 Row Level Security (RLS)
Todas as tabelas possuem RLS habilitado. Cada usuario so acessa seus proprios dados via `auth.uid()`.

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| profiles | auth.uid() = id | auth.uid() = id | auth.uid() = id | - |
| subjects | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id |
| study_sessions | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id |

### 4.4 Triggers
1. **on_auth_user_created** - Cria registro em `profiles` automaticamente quando um usuario faz signup (extrai nome e foto do metadata do Google)
2. **set_profiles_updated_at** - Atualiza `updated_at` automaticamente ao modificar perfil
3. **set_subjects_updated_at** - Atualiza `updated_at` automaticamente ao modificar materia

---

## 5. Autenticacao

### 5.1 Metodos suportados
- **Email/Senha** - Cadastro com nome, email e senha (minimo 6 chars)
- **Google OAuth** - Login com conta Google (configurado no Google Cloud Console)

### 5.2 Fluxo de autenticacao

```
[Usuario abre app]
       |
[ProtectedRoute verifica sessao]
       |
   [Logado?] ── Sim ──> [Dashboard]
       |
      Nao
       |
[Redirect /auth]
       |
[Login ou Signup]
       |
   [Sucesso?] ── Sim ──> [Trigger cria profile] ──> [Dashboard]
       |
      Nao
       |
[Toast de erro]
```

### 5.3 Componentes envolvidos
- `AuthContext.tsx` - Provider global com estado do usuario
- `ProtectedRoute.tsx` - Wrapper que redireciona para /auth se nao logado
- `Auth.tsx` - Pagina de login/signup
- `App.tsx` - AuthRedirect impede usuario logado de acessar /auth

### 5.4 Configuracao OAuth
- **Google Cloud Console:** Projeto com credenciais OAuth 2.0
- **Callback URL:** `https://ndxphrglwwdftripdcjm.supabase.co/auth/v1/callback`
- **Redirect URLs configurados no Supabase:**
  - `http://localhost:8080` (desenvolvimento)
  - `https://planejamento.estudante.mcconsultoriati.com.br` (producao)
  - `com.studyflow.app://**` (app nativo)

---

## 6. Funcionalidades por Pagina

### 6.1 Dashboard (/)
A tela inicial mostra um resumo do dia do usuario.

**Dados exibidos:**
- Numero de sessoes completadas hoje
- Streak (dias consecutivos de estudo)
- Horas estudadas hoje
- Progresso da meta semanal (anel de progresso)
- Indicador visual de progresso por dia da semana
- Lista das sessoes do dia com horarios e duracao

**Estado vazio:** Mostra CTA "Iniciar Foco" quando nao ha sessoes

**Hooks utilizados:** `useTodaySessions`, `useGoalProgress`, `useStreak`

### 6.2 Materias (/subjects)
Gerenciamento de disciplinas de estudo.

**Funcionalidades:**
- Listagem em grid 2 colunas com badges coloridos
- Contagem de sessoes e horas por materia
- Criar nova materia (dialog com nome + seletor de cor)
- Arquivar materia (soft delete com hover para revelar botao)
- Validacao de nome unico por usuario

**Hooks utilizados:** `useSubjects`, `useCreateSubject`, `useDeleteSubject`, `useStudySessions`

### 6.3 Modo Foco (/focus)
Timer Pomodoro completo com persistencia.

**Funcionalidades:**
- Timer circular com progresso visual (SVG)
- Fases: "Foco Profundo" (roxo) e "Intervalo" (verde)
- Duracao configuravel via perfil do usuario
- Seletor de materia (dropdown, visivel quando pausado)
- Controles: Play/Pause, Reset, Completar
- Contador de sessoes (4 pontos)
- Transicao automatica entre foco e intervalo
- Animacoes suaves (Framer Motion)

**Persistencia:**
- Ao iniciar: cria registro em `study_sessions` com `started_at`
- Ao completar: atualiza `ended_at` e `duration_seconds`
- Ao resetar: salva sessao parcial

**Hooks utilizados:** `useSubjects`, `useProfile`, `useCreateSession`, `useUpdateSession`

### 6.4 Relatorios (/analytics)
Dashboard de analytics com graficos.

**Dados exibidos:**
- 4 cards: Total de horas, Streak, Meta diaria %, Sessoes
- Grafico de barras: Horas por dia da semana (Seg-Dom)
- Breakdown por materia: nome, horas, percentual, barra de progresso
- 3 aneis de progresso: Meta semanal, mensal, diaria

**Calculos:** Todos feitos client-side com useMemo sobre dados cacheados pelo React Query

**Hooks utilizados:** `useWeeklyAnalytics`, `useGoalProgress`, `useStreak`

### 6.5 Configuracoes (/settings)
Perfil e preferencias do usuario.

**Funcionalidades:**
- Exibicao do perfil (foto, nome, email)
- Editar metas de estudo (dialog com inputs numericos)
  - Meta diaria (0.5 a 24h)
  - Meta semanal (1 a 168h)
  - Meta mensal (1 a 744h)
- Editar timer Pomodoro (dialog)
  - Duracao do foco (5 a 120min)
  - Duracao do intervalo (1 a 30min)
- Placeholders para: Notificacoes, Aparencia
- Botao de logout funcional

**Hooks utilizados:** `useAuth`, `useProfile`, `useUpdateProfile`

### 6.6 Autenticacao (/auth)
Pagina de login e cadastro.

**Funcionalidades:**
- Toggle login/signup
- Campos: Nome (signup), Email, Senha
- Botao Google OAuth com icone SVG
- Validacao: campos obrigatorios, senha 6+ chars
- Loading state nos botoes
- Toast de erro/sucesso
- Redirect para Dashboard apos login

---

## 7. Hooks de Dados (React Query)

Todos os hooks seguem o padrao React Query com invalidacao automatica.

### 7.1 useProfile.ts
```typescript
useProfile()         // GET perfil do usuario logado
useUpdateProfile()   // PATCH atualizar metas e configuracoes
```

### 7.2 useSubjects.ts
```typescript
useSubjects()        // GET materias ativas (is_archived = false)
useCreateSubject()   // POST criar materia (nome + cor)
useUpdateSubject()   // PATCH renomear ou mudar cor
useDeleteSubject()   // PATCH arquivar (soft delete)
```

### 7.3 useStudySessions.ts
```typescript
useStudySessions(from?, to?)  // GET sessoes com filtro de data
useTodaySessions()            // GET sessoes de hoje
useWeekSessions()             // GET sessoes da semana (seg-dom)
useMonthSessions()            // GET sessoes do mes
useCreateSession()            // POST iniciar nova sessao
useUpdateSession()            // PATCH finalizar sessao (ended_at + duration)
useDeleteSession()            // DELETE remover sessao
```

### 7.4 useAnalytics.ts
```typescript
useWeeklyAnalytics()  // Retorna: dailyHours[], totalHours, sessionCount, subjectBreakdown[]
useGoalProgress()     // Retorna: daily/weekly/monthly { current, target, pct }
useStreak()           // Retorna: numero de dias consecutivos com estudo
```

### Configuracao do QueryClient
- **staleTime:** 5 minutos (evita refetch desnecessario)
- **gcTime:** 30 minutos (cache em memoria)
- **retry:** 1 tentativa em caso de erro

---

## 8. Componentes Customizados

### StudyCard
Card que exibe uma sessao de estudo. Dois modos: normal (lista) e destacado (proximo).

**Props:** subject, topic?, startTime, endTime, duration, isNext?, onStart?

### StatCard
Card de estatistica com icone, valor e tendencia opcional.

**Props:** icon (LucideIcon), label, value, trend?, trendUp?

### ProgressRing
Anel de progresso circular em SVG puro (sem dependencias).

**Props:** progress (0-100), size?, strokeWidth?, label?, sublabel?

### SubjectBadge
Badge colorido de materia com contadores.

**Props:** name, color, sessions?, hours?

**Mapa de cores:**
| Chave | HSL |
|-------|-----|
| indigo | hsl(243, 75%, 59%) |
| emerald | hsl(142, 71%, 45%) |
| amber | hsl(38, 92%, 50%) |
| sky | hsl(199, 89%, 48%) |
| rose | hsl(347, 77%, 50%) |
| violet | hsl(263, 70%, 50%) |

### AppLayout
Layout principal com navegacao bottom bar fixa.

**Abas:** Inicio, Materias, Foco, Relatorios, Config

### ProtectedRoute
Wrapper de rota que verifica autenticacao. Mostra spinner enquanto carrega, redireciona para /auth se nao autenticado.

---

## 9. Estilizacao e Tema

### Paleta de Cores
- **Primary:** Indigo hsl(243, 75%, 59%)
- **Accent/Success:** Emerald hsl(142, 71%, 45%)
- **Destructive:** Red hsl(0, 84%, 60%)
- **Background (light):** hsl(0, 0%, 98%)
- **Background (dark):** hsl(240, 10%, 3.9%)

### Tipografia
- **Fonte:** Inter (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700

### Design System
- **Border radius:** 12px padrao (0.75rem)
- **Sombras:** shadow-card, shadow-elevated
- **Animacoes:** accordion, pulse-ring, count-down
- **Dark mode:** Suportado via classe CSS

### Safe Areas (Mobile)
```css
padding: env(safe-area-inset-top) env(safe-area-inset-right)
         env(safe-area-inset-bottom) env(safe-area-inset-left);
```

---

## 10. Configuracao Mobile (Capacitor)

### Identificacao
- **App ID:** com.studyflow.app
- **App Name:** StudyFlow
- **Web Dir:** dist/

### Plugins configurados
| Plugin | Configuracao |
|--------|-------------|
| SplashScreen | Auto-hide apos 2s, fundo branco |
| StatusBar | Estilo dark, fundo branco |
| Keyboard | Resize body, suporte fullscreen |

### Build Scripts
```bash
npm run cap:sync     # Sincroniza web -> nativo
npm run cap:ios      # Build + sync + abre Xcode
npm run cap:android  # Build + sync + abre Android Studio
```

### Assets Gerados
- **Android:** 61 arquivos (icones ldpi ate xxxhdpi + splash screens)
- **iOS:** 4 arquivos (icone 512@2x + splash 1x/2x/3x)
- **PWA:** 7 icones webp (48px ate 512px)

---

## 11. Seguranca

### Row Level Security
Todas as tabelas possuem RLS. Usuarios so acessam seus proprios dados.

### Autenticacao
- Tokens JWT com refresh automatico
- Sessao persistida em localStorage
- Publishable key (anon) exposta no client (seguro por design do Supabase)
- Service role key NUNCA exposta no frontend

### Validacoes
- Senha minima de 6 caracteres
- Nome unico de materia por usuario (constraint SQL)
- Check constraint no tipo de sessao ('focus' | 'break')

---

## 12. Variaveis de Ambiente

```
VITE_SUPABASE_PROJECT_ID    = ndxphrglwwdftripdcjm
VITE_SUPABASE_URL           = https://ndxphrglwwdftripdcjm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_hMC-Vw_VYXMEr4dIWs-vIw_KGcHIhni
```

---

## 13. Scripts Disponiveis

```bash
npm run dev          # Servidor de desenvolvimento (porta 8080)
npm run build        # Build de producao
npm run build:dev    # Build modo desenvolvimento
npm run lint         # Verificacao ESLint
npm run preview      # Preview do build de producao
npm run test         # Rodar testes unitarios
npm run test:watch   # Testes em modo watch
npm run cap:sync     # Sincronizar Capacitor
npm run cap:ios      # Build e abrir no Xcode
npm run cap:android  # Build e abrir no Android Studio
```

---

## 14. Deploy

### Web (HostGator)
1. `npm run build`
2. Upload do conteudo de `dist/` via FTP/cPanel
3. Dominio: https://planejamento.estudante.mcconsultoriati.com.br

### iOS (App Store)
1. `npm run cap:ios`
2. Archive no Xcode
3. Upload via App Store Connect
4. Requisito: Apple Developer Program ($99/ano)

### Android (Google Play)
1. `npm run cap:android`
2. Generate Signed AAB no Android Studio
3. Upload via Google Play Console
4. Requisito: Google Play Developer ($25 unico)

**Guia detalhado:** ver arquivo `GUIA_DEPLOY.md`

---

## 15. Melhorias Futuras

| Prioridade | Feature | Descricao |
|-----------|---------|-----------|
| Alta | Notificacoes push | Lembretes de estudo via Capacitor Local Notifications |
| Alta | Modo offline | Persistir cache React Query + sync ao reconectar |
| Media | Dark mode toggle | Alternancia de tema (infraestrutura pronta) |
| Media | Export de dados | Exportar relatorios em PDF/CSV |
| Media | Agendamento | Agendar sessoes futuras com calendario |
| Baixa | Integracao Google Calendar | Sincronizar sessoes com calendario |
| Baixa | Sessoes colaborativas | Estudar em grupo com timer compartilhado |
| Baixa | Gamificacao | Conquistas e badges por metas atingidas |

---

## 16. Contatos e Acessos

| Recurso | Acesso |
|---------|--------|
| GitHub | github.com/mcoutinho2512/study-flow-pro |
| Supabase Dashboard | supabase.com/dashboard (projeto ndxphrglwwdftripdcjm) |
| Google Cloud Console | console.cloud.google.com (projeto StudyFlow) |
| Dominio Web | planejamento.estudante.mcconsultoriati.com.br |
| HostGator cPanel | Acesso via painel MC Consultoria TI |
