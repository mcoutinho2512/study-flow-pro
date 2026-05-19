# Estudae — Plano de Estudos

App mobile (iOS + Android) e web para organização de estudos: planner semanal, timer Pomodoro, anotações por matéria, relatórios. Backend em Supabase.

**Bundle ID / Package:** `br.com.mcconsultoriati.estudae`
**Repositório:** https://github.com/mcoutinho2512/study-flow-pro
**Owner:** Magnun Coutinho (MC Tech Consultoria em TI LTDA)

---

## Status atual (atualize ao mexer)

- ✅ **iOS:** versão 1.0 (build 12) **aprovada pela App Store em 2026-05-19**, aguardando release manual
- 🔄 **Android:** em preparação para Play Store (Maio 2026). Keystore gerado, Android Studio sendo instalado, AAB ainda não compilado
- 🔄 **Backend Supabase:** ativo (projeto `ndxphrglwwdftripdcjm`, free tier — pausa por inatividade)

---

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind + shadcn/ui |
| Mobile shell | Capacitor 8 (iOS via Swift Package Manager, Android via Gradle) |
| Auth + DB | Supabase (Postgres + Auth + RLS) |
| OAuth | Supabase OAuth (PKCE flow) + Apple Sign In nativo (iOS) |
| State | TanStack Query + React Context |
| Roteamento | React Router v6 |
| Testes | Vitest + jsdom |
| Build assets | @capacitor/assets (ícones e splash) |

---

## Estrutura do projeto

```
/
├── src/                          # código React (web + mobile via Capacitor)
│   ├── App.tsx                   # rotas + auth redirects com timeout
│   ├── components/
│   │   └── ProtectedRoute.tsx    # gate com timeout de 8s (anti-tela-branca iOS)
│   ├── contexts/
│   │   └── AuthContext.tsx       # Apple Sign In nativo + Google OAuth + email/senha
│   ├── pages/                    # Auth, Home, Materias, Planner, Settings, etc.
│   └── integrations/supabase/    # client + types gerados
├── ios/                          # projeto Xcode (GITIGNORED, não vai pro repo)
├── android/                      # projeto Android (GITIGNORED, não vai pro repo)
├── patches/                      # patches do patch-package
│   └── @capacitor-community+apple-sign-in+7.1.0.patch  # fix Capacitor 8
├── appstore/                     # metadados, política, capturas
├── public/privacidade.html       # política de privacidade (acessível via URL)
├── capacitor.config.ts           # config Capacitor (appId, plugins)
└── .env                          # SUPABASE_URL + PUBLISHABLE_KEY (GITIGNORED)
```

**Importante:** `ios/` e `android/` estão no `.gitignore` raiz. Mudanças nativas (pbxproj, build.gradle, keystore) NÃO vão pro git. Isso é por escolha do projeto.

---

## Comandos essenciais

```bash
# Desenvolvimento web
npm run dev                      # vite dev server

# Build
npm run build                    # gera dist/ (Vite)
npm run lint
npm test                         # vitest

# Sync mobile
npm run cap:ios                  # build + sync + abre Xcode
npm run cap:android              # build + sync + abre Android Studio
npx cap sync ios                 # só sync iOS
npx cap sync android             # só sync Android
```

**Sempre rode `npm run build && npx cap sync <platform>` antes de archivar/buildar nativo.**

---

## Variáveis de ambiente

Arquivo `.env` (gitignored — peça ao Magnun ou recrie via Supabase Dashboard):

```
VITE_SUPABASE_PROJECT_ID=ndxphrglwwdftripdcjm
VITE_SUPABASE_URL=https://ndxphrglwwdftripdcjm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable_key>
```

---

## Backend (Supabase)

- **Project ID:** `ndxphrglwwdftripdcjm`
- **Region:** us-west-2 (Oregon)
- **Plan:** Free (pausa após inatividade — usar MCP `restore_project` ou dashboard pra reativar)
- **Dashboard:** https://supabase.com/dashboard/project/ndxphrglwwdftripdcjm

**Auth providers configurados:**
- Email/senha (com confirmação por email)
- Google OAuth
- Apple Sign In (com `Allow users without email` habilitado — exigência da Apple)

**Tabelas principais:** profiles, materias, sessoes, blocos_planner, anotacoes, configuracoes

**RLS:** habilitado em todas as tabelas — cada usuário só acessa seus próprios dados via `auth.uid()`

---

## Build / Deploy — iOS

### Pré-requisitos
- Xcode 16+
- Conta Apple Developer ($99/ano) já paga (MC TECH CONSULTORIA E SERVICOS EM TI LTDA)
- Apple ID configurado em Xcode → Settings → Accounts

### Workflow
1. `npm run build && npx cap sync ios`
2. Abrir `ios/App/App.xcodeproj` no Xcode
3. Em **General**, bumpar **Build** (ex.: 12 → 13)
4. Selecionar destino **"Any iOS Device (arm64)"**
5. **Product → Clean Build Folder** (⇧⌘K)
6. **Product → Archive**
7. No Organizer: **Distribute App → App Store Connect → Upload**
8. Aguardar build aparecer no App Store Connect (5-15min)
9. Submeter via App Store Connect → Distribuição → Adicionar para Revisão

### Configurações críticas no pbxproj (já aplicadas)
- `CURRENT_PROJECT_VERSION = <build>` (Debug + Release)
- `OTHER_LDFLAGS = (-ObjC,)` — força linker a preservar classes Objective-C de SPM transitivos (resolve "plugin not implemented on ios")
- `INFOPLIST_KEY_LSApplicationCategoryType = public.app-category.education`
- `CODE_SIGN_ENTITLEMENTS = App/App.entitlements` (Sign in with Apple)

### Gotchas iOS conhecidos
- **"plugin is not implemented on ios"** → falta `-ObjC` no linker OU SPM não resolveu. Reset Package Caches no Xcode + Clean Build.
- **Apple Sign In falha no iPad** → checar Supabase auth setting "Allow users without email" habilitado
- **Build duplicado no upload** → bumpar `CURRENT_PROJECT_VERSION`

---

## Build / Deploy — Android (EM PROGRESSO)

### Pré-requisitos
- JDK 17 (`brew install openjdk@17`) ✅ instalado
- Android Studio (`brew install --cask android-studio`) 🔄 baixando

### Keystore (CRÍTICO — SEGREDO)
- **Arquivo:** `android/app/estudae-release.keystore` (gitignored)
- **Alias:** `estudae`
- **Senha:** salva em 1Password / gerenciador do usuário (NUNCA está no repo)
- **Validade:** 10000 dias
- **Backup:** o usuário deve manter cópia OFFLINE (perder = não consegue mais atualizar o app na Play Store)

Senhas lidas via `android/keystore.properties` (gitignored) — exemplo:
```properties
storePassword=<senha>
keyPassword=<senha>
keyAlias=estudae
storeFile=estudae-release.keystore
```

### Workflow
1. `npm run build && npx cap sync android`
2. Abrir `android/` no Android Studio
3. Bumpar `versionCode` em `android/app/build.gradle` (1 → 2 → 3...)
4. **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**
5. Selecionar keystore `estudae-release.keystore`, senha, alias `estudae`
6. Build type: **release**
7. AAB gerado em `android/app/release/app-release.aab`
8. Upload no Google Play Console

### Play Console
- **Conta:** ativa (usuário pagou $25)
- **Play App Signing:** habilitar no primeiro upload (Google gerencia chave final; nosso keystore vira "upload key")

---

## Credenciais de teste (para reviewers de loja)

```
Email: teste@estudae.app
Senha: Teste12345
```

Conta existe em Supabase auth.users (`afdbe786-fa65-49a1-8cf7-8472f5eb88f1`), confirmada. **NUNCA delete essa conta** — qualquer review futuro vai usá-la.

---

## Decisões técnicas importantes (não obvias)

### Apple Sign In nativo (não OAuth web)
- Usamos `@capacitor-community/apple-sign-in@7.1.0` com fluxo nativo `ASAuthorizationAppleIDProvider`
- Token JWT enviado pro Supabase via `signInWithIdToken` com nonce SHA256
- Apple rejeitou 5+ vezes o app antes — fluxo nativo + nonce foi o que finalmente passou
- Plugin v7.1.0 é a última versão (não há v8 ainda) — patch em `patches/` amplia a faixa de versão do `capacitor-swift-pm` para aceitar Capacitor 8

### PKCE flow no Supabase
- `flowType: 'pkce'` em `src/integrations/supabase/client.ts`
- Previne interceptação de auth code via deep link spoofing (apps maliciosos com mesmo URL scheme)
- NUNCA reverta isso — é exigência de segurança moderna

### Storage seguro (iOS Keychain / Android EncryptedSharedPreferences)
- Tokens persistem via `@capacitor/preferences` (não `localStorage`)
- `secureStorage` adapter em `src/integrations/supabase/client.ts`
- Web cai pro localStorage como fallback

### Safety timeouts contra spinner infinito
- `ProtectedRoute.tsx` força render após 8s mesmo se `loading` continuar true
- `App.tsx` faz o mesmo com 5s no `AuthRedirect`
- Causa: bug intermitente do `supabase.auth.getSession()` no iOS/iPad (Apple Review rejeitou por isso)

---

## Patches ativos (patch-package)

Aplicados automaticamente via `postinstall`:

- **`patches/@capacitor-community+apple-sign-in+7.1.0.patch`**
  Amplia faixa de versão de `capacitor-swift-pm` de `from: "7.0.0"` para `"7.0.0"..<"9.0.0"`. Sem isso, o plugin não compila com Capacitor 8.

---

## URL Schemes & Deep Links

- Scheme registrado no `Info.plist`: `br.com.mcconsultoriati.estudae://`
- Usado para callback OAuth do Google
- Apple OAuth callback: `https://ndxphrglwwdftripdcjm.supabase.co/auth/v1/callback`

---

## Submissões anteriores (histórico Apple)

App foi rejeitado 6x antes de aprovar. Causas:
1. Sign in with Apple não funcionava no iPad → corrigido com fluxo nativo + nonce
2. Spinner infinito no login → corrigido com timeouts em `ProtectedRoute`/`AuthRedirect`
3. Demo account inexistente → criado `teste@estudae.app`
4. Plugin Apple Sign In não estava sendo linkado → corrigido com `-ObjC` no `OTHER_LDFLAGS`
5. Identifier mismatch StudyFlow vs Estudae → rebrand completo
6. Build com versão duplicada → procedimento de bump documentado

---

## Coisas a NUNCA fazer

1. **NÃO commitar o keystore Android** (`android/app/estudae-release.keystore`)
2. **NÃO commitar `keystore.properties`** ou `.env`
3. **NÃO mexer no `flowType: 'pkce'`** ou no `secureStorage` adapter sem entender impacto
4. **NÃO remover o patch** de `apple-sign-in` enquanto plugin oficial não suportar Capacitor 8
5. **NÃO deletar a conta `teste@estudae.app`** no Supabase
6. **NÃO mudar o `appId`/`Bundle ID`** — quebra Sign in with Apple e App Store
7. **NÃO mudar Supabase project ID** sem atualizar Apple/Google OAuth callbacks

---

## Para continuar uma tarefa pendente

Ao retomar trabalho em outro computador:

1. Clone o repo: `git clone git@github.com:mcoutinho2512/study-flow-pro.git`
2. Instale deps: `npm install --legacy-peer-deps` (patch-package roda automaticamente)
3. Crie `.env` na raiz com as 3 vars do Supabase (peça ao Magnun)
4. `npm run dev` — sobe web local
5. Para mobile:
   - iOS: precisa macOS + Xcode + `npx cap sync ios && npx cap open ios`
   - Android: precisa Android Studio + keystore (peça ao Magnun) em `android/app/`
6. Antes de qualquer build nativo: **leia este arquivo inteiro**
7. Antes de commitar: **confira que nada sensível vai junto** (use `git status` e cheque `.gitignore`)
