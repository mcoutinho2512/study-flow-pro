# StudyFlow Pro - Guia Completo de Deploy

## Indice

1. [Passo 1: Criar as tabelas no Supabase](#passo-1-criar-as-tabelas-no-supabase)
2. [Passo 2: Configurar Google OAuth (gratuito)](#passo-2-configurar-google-oauth-gratuito)
3. [Passo 3: Testar o app na web](#passo-3-testar-o-app-na-web)
4. [Passo 4: Gerar icones e splash screens](#passo-4-gerar-icones-e-splash-screens)
5. [Passo 5: Testar no iOS (Simulador)](#passo-5-testar-no-ios-simulador)
6. [Passo 6: Testar no Android (Emulador)](#passo-6-testar-no-android-emulador)
7. [Passo 7: Publicar na Google Play Store](#passo-7-publicar-na-google-play-store)
8. [Passo 8: Publicar na Apple App Store](#passo-8-publicar-na-apple-app-store)

---

## Passo 1: Criar as tabelas no Supabase

Este passo cria o banco de dados que o app precisa para funcionar.

### 1.1 Acessar o painel do Supabase

1. Abra o navegador e acesse: **https://supabase.com/dashboard**
2. Faça login com sua conta
3. No menu lateral esquerdo, clique no seu projeto **gmzzkkxbapygdqaxlidv**

### 1.2 Abrir o SQL Editor

1. No menu lateral do projeto, clique em **SQL Editor** (icone de banco de dados)
2. Clique no botao **+ New query** (ou "Nova consulta")

### 1.3 Executar o SQL

1. Abra o arquivo `supabase/migrations/001_initial_schema.sql` do projeto
2. Copie **TODO** o conteudo do arquivo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase (Ctrl+V)
4. Clique no botao **Run** (ou pressione Ctrl+Enter)
5. Aguarde a mensagem **"Success. No rows returned"** - isso e normal e significa que funcionou!

### 1.4 Verificar se deu certo

1. No menu lateral, clique em **Table Editor**
2. Voce deve ver 3 tabelas:
   - `profiles`
   - `subjects`
   - `study_sessions`
3. Clique em cada uma para verificar que as colunas estao corretas

### 1.5 Verificar as politicas de seguranca (RLS)

1. No menu lateral, clique em **Authentication** > **Policies**
2. Verifique que cada tabela tem 3-4 politicas (SELECT, INSERT, UPDATE, DELETE)
3. Se aparecer "RLS enabled" em cada tabela, esta correto

---

## Passo 2: Configurar Google OAuth (gratuito)

Este passo permite que usuarios facam login com a conta Google.

### 2.1 Criar um projeto no Google Cloud Console

1. Acesse: **https://console.cloud.google.com**
2. Faca login com sua conta Google
3. No topo da pagina, clique no seletor de projetos (ao lado de "Google Cloud")
4. Clique em **Novo Projeto**
5. Nome do projeto: `StudyFlow`
6. Clique em **Criar**
7. Aguarde criar e selecione o projeto

### 2.2 Configurar a Tela de Consentimento OAuth

1. No menu lateral, va em **APIs e Servicos** > **Tela de consentimento OAuth**
2. Selecione **Externo** e clique **Criar**
3. Preencha:
   - Nome do app: `StudyFlow`
   - E-mail de suporte: seu e-mail
   - E-mail do desenvolvedor: seu e-mail
4. Clique **Salvar e Continuar**
5. Na tela de Escopos, clique **Salvar e Continuar** (nao precisa adicionar nada)
6. Na tela de Usuarios de teste, clique **Salvar e Continuar**
7. Clique **Voltar ao Painel**

### 2.3 Criar as Credenciais OAuth

1. No menu lateral, va em **APIs e Servicos** > **Credenciais**
2. Clique **+ Criar Credenciais** > **ID do cliente OAuth**
3. Tipo de aplicativo: **Aplicativo da Web**
4. Nome: `StudyFlow Web`
5. Em **Origens JavaScript autorizadas**, adicione:
   - `http://localhost:8080`
   - `https://gmzzkkxbapygdqaxlidv.supabase.co`
6. Em **URIs de redirecionamento autorizados**, adicione:
   - `https://gmzzkkxbapygdqaxlidv.supabase.co/auth/v1/callback`
7. Clique **Criar**
8. **ANOTE** o `Client ID` e o `Client Secret` que aparecerao na tela (voce vai precisar no proximo passo)

### 2.4 Configurar no Supabase

1. Volte ao painel do Supabase: **https://supabase.com/dashboard**
2. Abra seu projeto
3. No menu lateral, va em **Authentication** > **Providers**
4. Procure **Google** na lista e clique para expandir
5. Ative o toggle **Enable Sign in with Google**
6. Cole o **Client ID** que voce anotou
7. Cole o **Client Secret** que voce anotou
8. Clique **Save**

### 2.5 Configurar URLs de Redirect

1. Ainda em **Authentication**, clique em **URL Configuration**
2. Em **Site URL**, coloque: `http://localhost:8080` (para desenvolvimento)
3. Em **Redirect URLs**, adicione:
   - `http://localhost:8080`
   - `http://localhost:8080/**`
   - `com.studyflow.app://**` (para o app nativo)
4. Clique **Save**

---

## Passo 3: Testar o app na web

### 3.1 Iniciar o servidor de desenvolvimento

```bash
cd /Users/magnuncoutinho/Desenvolvimento/app-plano-estudo
npm run dev
```

O terminal vai mostrar: `Local: http://localhost:8080/`

### 3.2 Testar o fluxo de autenticacao

1. Abra **http://localhost:8080** no navegador
2. Voce sera redirecionado para a tela de login (`/auth`)
3. **Teste criar conta:**
   - Clique em "Cadastre-se"
   - Preencha nome, e-mail e senha (minimo 6 caracteres)
   - Clique "Criar Conta"
   - Verifique seu e-mail e clique no link de confirmacao
   - Volte ao app e faca login
4. **Teste login com Google:**
   - Clique "Continuar com Google"
   - Selecione sua conta Google
   - Voce sera redirecionado de volta ao app

### 3.3 Testar as funcionalidades

1. **Materias** - Va na aba "Materias":
   - Clique no botao "+" para criar uma materia
   - Preencha o nome e escolha uma cor
   - Verifique que apareceu na lista

2. **Modo Foco** - Va na aba "Foco":
   - Selecione uma materia no dropdown
   - Clique no play para iniciar o timer
   - Clique no check para completar a sessao
   - Verifique que apareceu um toast "Sessao salva!"

3. **Dashboard** - Volte para "Inicio":
   - A sessao que voce completou deve aparecer
   - Os contadores devem mostrar seus dados reais

4. **Relatorios** - Va na aba "Relatorios":
   - Os graficos devem refletir suas sessoes

5. **Configuracoes** - Va na aba "Config":
   - Seu nome e e-mail devem aparecer
   - Teste editar metas de estudo
   - Teste editar tempo do Pomodoro
   - Teste fazer logout

### 3.4 Verificar dados no Supabase

1. Volte ao painel do Supabase > **Table Editor**
2. Clique na tabela `profiles` - deve ter seu perfil
3. Clique na tabela `subjects` - deve ter suas materias
4. Clique na tabela `study_sessions` - deve ter suas sessoes

---

## Passo 4: Gerar icones e splash screens

### 4.1 Criar a imagem do icone

1. Crie uma imagem PNG do icone do app:
   - Tamanho: **1024 x 1024 pixels**
   - Formato: PNG
   - Fundo solido (sem transparencia para iOS)
   - Use o Figma, Canva, ou qualquer editor de imagem
   - Sugestao: fundo roxo (#6C63FF) com a letra "S" branca

2. Crie uma imagem PNG para o splash screen:
   - Tamanho: **2732 x 2732 pixels**
   - Formato: PNG
   - Mesmo estilo do icone, porem maior

### 4.2 Salvar as imagens

```bash
# Crie a pasta assets na raiz do projeto
mkdir -p /Users/magnuncoutinho/Desenvolvimento/app-plano-estudo/assets

# Copie suas imagens para la:
# assets/icon-only.png    (1024x1024 - icone do app)
# assets/splash.png       (2732x2732 - splash screen)
# assets/icon-foreground.png  (1024x1024 - foreground para Android adaptive icon)
# assets/icon-background.png  (1024x1024 - background para Android adaptive icon)
```

### 4.3 Gerar automaticamente todos os tamanhos

```bash
cd /Users/magnuncoutinho/Desenvolvimento/app-plano-estudo
npx capacitor-assets generate \
  --iconBackgroundColor '#6C63FF' \
  --splashBackgroundColor '#FFFFFF'
```

Isso gera automaticamente:
- Todos os tamanhos de icone para iOS (20x20 ate 1024x1024)
- Todos os tamanhos de icone para Android (mdpi ate xxxhdpi)
- Splash screens para todos os tamanhos de tela

---

## Passo 5: Testar no iOS (Simulador)

**Requisitos:**
- Mac com macOS
- Xcode instalado (baixe na App Store, gratuito, ~12GB)

### 5.1 Instalar o Xcode

1. Abra a **App Store** no Mac
2. Pesquise "Xcode"
3. Clique em **Obter/Instalar** (gratuito, mas ~12GB)
4. Aguarde a instalacao
5. Abra o Xcode uma vez e aceite os termos de licenca
6. Instale os componentes adicionais quando solicitado

### 5.2 Instalar ferramentas de linha de comando

```bash
xcode-select --install
```

### 5.3 Build e abrir no Xcode

```bash
cd /Users/magnuncoutinho/Desenvolvimento/app-plano-estudo
npm run cap:ios
```

Isso vai:
1. Fazer o build do projeto web (`vite build`)
2. Sincronizar com o projeto iOS (`cap sync ios`)
3. Abrir o projeto no Xcode (`cap open ios`)

### 5.4 Rodar no Simulador

1. No Xcode, no topo, selecione um simulador (ex: "iPhone 16")
2. Clique no botao **Play** (triangulo) ou pressione **Cmd+R**
3. O simulador vai abrir e o app vai carregar
4. Teste todas as funcionalidades

### 5.5 Testar em um iPhone fisico (opcional)

1. Conecte seu iPhone ao Mac via cabo USB
2. No Xcode, selecione seu dispositivo no seletor (topo)
3. Na primeira vez, va em **Xcode > Settings > Accounts** e adicione sua Apple ID
4. No Xcode, selecione o projeto "App" no navegador lateral
5. Em **Signing & Capabilities**, marque **Automatically manage signing**
6. Selecione seu "Team" (sua Apple ID pessoal funciona para testes)
7. Clique **Play** para instalar no iPhone
8. No iPhone, va em **Ajustes > Geral > Gerenciamento de Dispositivo** e confie no desenvolvedor

---

## Passo 6: Testar no Android (Emulador)

**Requisitos:**
- Android Studio instalado (gratuito, ~2GB)

### 6.1 Instalar o Android Studio

1. Acesse: **https://developer.android.com/studio**
2. Baixe e instale o Android Studio
3. Na instalacao, marque para instalar o **Android SDK** e **Android Virtual Device (AVD)**
4. Abra o Android Studio e complete o setup wizard

### 6.2 Criar um Emulador (AVD)

1. No Android Studio, va em **Tools > Device Manager** (ou **Virtual Device Manager**)
2. Clique em **Create Device**
3. Selecione **Pixel 7** (ou outro modelo)
4. Clique **Next**
5. Selecione uma imagem do sistema (ex: **API 34 - Android 14**) e clique **Download** se necessario
6. Clique **Next** > **Finish**

### 6.3 Build e abrir no Android Studio

```bash
cd /Users/magnuncoutinho/Desenvolvimento/app-plano-estudo
npm run cap:android
```

### 6.4 Rodar no Emulador

1. No Android Studio, no topo, selecione o emulador que voce criou
2. Clique no botao **Play** (triangulo verde) ou pressione **Shift+F10**
3. O emulador vai abrir e o app vai carregar
4. Teste todas as funcionalidades

### 6.5 Testar em um Android fisico (opcional)

1. No celular, ative **Opcoes do desenvolvedor**:
   - Va em **Configuracoes > Sobre o telefone**
   - Toque 7 vezes em **Numero da versao**
2. Ative **Depuracao USB** em **Opcoes do desenvolvedor**
3. Conecte o celular ao computador via USB
4. Aceite a autorizacao de depuracao no celular
5. No Android Studio, selecione seu dispositivo e clique **Play**

---

## Passo 7: Publicar na Google Play Store

**Custo:** $25 (pagamento unico, para sempre)

### 7.1 Criar conta de desenvolvedor

1. Acesse: **https://play.google.com/console**
2. Clique em **Criar conta de desenvolvedor**
3. Pague a taxa de $25 (cartao de credito/debito)
4. Preencha seus dados pessoais
5. Aceite os termos de servico
6. Aguarde a verificacao (pode levar ate 48h)

### 7.2 Criar a Politica de Privacidade

Voce PRECISA de uma politica de privacidade publicada online. Opcoes:

**Opcao A - Gerar automaticamente (rapido):**
1. Acesse: **https://app-privacy-policy-generator.nisrulz.com/**
2. Preencha:
   - App Name: `StudyFlow`
   - Developer Name: Seu nome
   - Marque: "Email Address", "Usage Data"
3. Gere a politica e hospede em uma pagina web (ex: GitHub Pages, Notion publica, ou Google Sites)

**Opcao B - GitHub Pages (gratuito):**
1. Crie um repositorio publico no GitHub (ex: `studyflow-privacy`)
2. Crie um arquivo `index.html` com a politica de privacidade
3. Ative GitHub Pages nas configuracoes do repositorio
4. A URL sera: `https://seuusuario.github.io/studyflow-privacy/`

### 7.3 Gerar o APK/AAB assinado

```bash
cd /Users/magnuncoutinho/Desenvolvimento/app-plano-estudo

# 1. Fazer build do projeto web
npm run build

# 2. Sincronizar com Android
npx cap sync android
```

3. Abra o Android Studio:
```bash
npx cap open android
```

4. No Android Studio:
   - Va em **Build > Generate Signed Bundle / APK**
   - Selecione **Android App Bundle (AAB)** (recomendado pelo Google)
   - Clique **Next**

5. Criar keystore (primeira vez):
   - Clique em **Create new...**
   - Escolha um local para salvar (ex: `~/studyflow-keystore.jks`)
   - **IMPORTANTE:** Guarde a senha e o arquivo em local seguro! Voce precisara deles para TODAS as atualizacoes futuras
   - Key alias: `studyflow`
   - Preencha pelo menos o nome e o pais
   - Clique **OK**

6. Selecione **release** e clique **Finish**
7. O AAB sera gerado em: `android/app/build/outputs/bundle/release/app-release.aab`

### 7.4 Publicar na Play Console

1. Volte ao **Google Play Console** (https://play.google.com/console)
2. Clique em **Criar app**
3. Preencha:
   - Nome do app: `StudyFlow - Plano de Estudos`
   - Idioma padrao: Portugues (Brasil)
   - App ou jogo: App
   - Gratuito ou pago: Gratuito
4. Aceite as declaracoes e clique **Criar app**

5. **Painel do app** - Preencha todas as secoes obrigatorias:

   **a) Ficha da Play Store (Store Listing):**
   - Titulo: `StudyFlow - Plano de Estudos`
   - Descricao curta (80 chars): `Organize seus estudos com timer Pomodoro e acompanhe seu progresso.`
   - Descricao completa: Escreva uma descricao detalhada do app
   - Icone: Upload do icone 512x512
   - Feature graphic: Imagem 1024x500
   - Screenshots: Pelo menos 2 screenshots do celular (tire do emulador)

   **b) Classificacao de conteudo:**
   - Responda o questionario da IARC
   - Seu app provavelmente sera classificado como "Livre"

   **c) Publico-alvo:**
   - Faixa etaria: 13+ (app de estudos)
   - Confirme que NAO e direcionado a criancas

   **d) Politica de privacidade:**
   - Cole a URL da politica que voce criou no passo 7.2

   **e) Acesso ao app:**
   - Selecione "Todas as funcionalidades estao disponiveis sem acesso restrito"
   - OU forneca credenciais de teste se o app exigir login

6. **Upload do AAB:**
   - Va em **Producao** (menu lateral)
   - Clique em **Criar nova versao**
   - Arraste o arquivo `.aab` para a area de upload
   - Preencha as notas da versao: "Versao inicial do StudyFlow"
   - Clique **Salvar** > **Revisar versao** > **Iniciar lancamento para producao**

7. **Aguarde a revisao** - O Google leva de 1 a 7 dias para revisar
8. Apos aprovado, o app estara disponivel na Play Store!

---

## Passo 8: Publicar na Apple App Store

**Custo:** $99/ano (Apple Developer Program)

### 8.1 Criar conta de desenvolvedor Apple

1. Acesse: **https://developer.apple.com/programs/**
2. Clique em **Enroll** (Inscrever-se)
3. Faca login com sua Apple ID (ou crie uma)
4. Selecione **Individual** (pessoa fisica)
5. Preencha seus dados pessoais
6. Pague a taxa de $99/ano
7. Aguarde a aprovacao (pode levar ate 48h)

### 8.2 Criar a Politica de Privacidade

Se voce ja criou no Passo 7.2, use a mesma URL. A Apple tambem exige uma politica de privacidade publica.

### 8.3 Configurar o projeto no Xcode

```bash
cd /Users/magnuncoutinho/Desenvolvimento/app-plano-estudo

# Build e sincronizar
npm run build
npx cap sync ios

# Abrir no Xcode
npx cap open ios
```

No Xcode:

1. **Selecione o projeto "App"** no navegador lateral (icone de pasta)
2. Clique no target **App**
3. Na aba **General**:
   - Display Name: `StudyFlow`
   - Bundle Identifier: `com.studyflow.app`
   - Version: `1.0.0`
   - Build: `1`
   - Deployment Target: `16.0` (ou a versao minima desejada)

4. Na aba **Signing & Capabilities**:
   - Marque **Automatically manage signing**
   - Team: Selecione sua conta Apple Developer (NAO a personal team)
   - Se der erro, verifique se sua conta foi aprovada no Apple Developer Program

### 8.4 Criar o App no App Store Connect

1. Acesse: **https://appstoreconnect.apple.com**
2. Clique em **Meus Apps** > botao **+** > **Novo App**
3. Preencha:
   - Plataformas: iOS
   - Nome: `StudyFlow - Plano de Estudos`
   - Idioma principal: Portugues (Brasil)
   - Bundle ID: `com.studyflow.app` (deve aparecer no dropdown)
   - SKU: `studyflow-001`
4. Clique **Criar**

### 8.5 Preencher as informacoes do app

No App Store Connect, preencha cada secao:

**a) Informacoes do App:**
- Categoria: Educacao
- Subcategoria: (opcional)
- Politica de Privacidade URL: Cole a URL da sua politica

**b) Preparar para Envio (Versao 1.0):**
- Screenshots (OBRIGATORIO):
  - iPhone 6.7" (1290 x 2796): pelo menos 3 screenshots
  - iPhone 6.5" (1284 x 2778): pelo menos 3 screenshots
  - (Para tirar screenshots: rode no simulador do Xcode e use Cmd+S)
- Descricao: Descricao completa do app
- Palavras-chave: estudos, pomodoro, timer, foco, materias, planejamento
- URL de Suporte: seu e-mail ou site
- Notas para revisao: "App de planejamento de estudos com timer Pomodoro e tracking de materias"

**c) Privacidade do App:**
- Clique em "Comecar" na secao de privacidade
- Selecione os dados que voce coleta:
  - Informacoes de contato (e-mail)
  - Dados de uso (sessoes de estudo)
- Indique que os dados NAO sao usados para rastreamento

**d) Classificacao etaria:**
- Responda o questionario
- Resultado esperado: 4+ (sem conteudo restrito)

### 8.6 Fazer o Archive e Upload

1. No Xcode, no topo, selecione **Any iOS Device** (nao um simulador)
2. Va em **Product > Archive** (Produto > Arquivar)
3. Aguarde o build completar (pode levar alguns minutos)
4. A janela **Organizer** vai abrir automaticamente
5. Selecione o archive e clique **Distribute App**
6. Selecione **App Store Connect** > **Upload**
7. Deixe todas as opcoes marcadas e clique **Upload**
8. Aguarde o upload finalizar

### 8.7 Enviar para Revisao

1. Volte ao **App Store Connect** (https://appstoreconnect.apple.com)
2. Abra seu app > **Versao 1.0**
3. Na secao **Build**, clique no botao **+** e selecione o build que voce acabou de enviar
   - Se o build nao aparecer, aguarde ~10 minutos para o processamento
4. Verifique que todas as secoes estao completas (sem alertas vermelhos)
5. Clique em **Adicionar para Revisao**
6. Clique em **Enviar para Revisao**

### 8.8 Aguardar aprovacao

- A Apple leva de **1 a 3 dias** para revisar (media: 24-48h)
- Voce recebera um e-mail quando o app for aprovado
- Se for rejeitado, o e-mail explicara o motivo e o que corrigir
- Motivos comuns de rejeicao:
  - Screenshots nao refletem o app real
  - Falta de politica de privacidade
  - App muito simples / parece uma web view
  - Bugs visiveis

---

## Dicas e Solucao de Problemas

### Google OAuth nao funciona no app nativo?

No app iOS/Android, o OAuth precisa de deep links. Se tiver problemas:

1. **iOS** - No Xcode, abra `ios/App/App/Info.plist` e adicione:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.studyflow.app</string>
    </array>
  </dict>
</array>
```

2. **Android** - Abra `android/app/src/main/AndroidManifest.xml` e adicione dentro da `<activity>`:
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="com.studyflow.app" />
</intent-filter>
```

### O app abre em branco no simulador?

```bash
# Rebuild e resync
npm run build
npx cap sync
```

### Erro de assinatura no Xcode?

1. Certifique-se de que sua conta Apple Developer esta ativa
2. Va em Xcode > Settings > Accounts e re-adicione sua conta
3. Em Signing & Capabilities, desmarque e re-marque "Automatically manage signing"

### Atualizando o app depois de publicado

```bash
# 1. Faca suas alteracoes no codigo

# 2. Incremente a versao no package.json e no Xcode/Android Studio

# 3. Build e sync
npm run build
npx cap sync

# 4. iOS: Archive no Xcode e upload
# 5. Android: Generate Signed Bundle no Android Studio e upload

# 6. No App Store Connect / Play Console: crie uma nova versao e envie para revisao
```

### Publicar o Google OAuth para producao

Enquanto o app estiver com o OAuth em modo "teste" no Google Cloud:
- Apenas e-mails adicionados como "usuarios de teste" conseguem fazer login
- Para liberar para todos:

1. Va em **Google Cloud Console** > **APIs e Servicos** > **Tela de consentimento OAuth**
2. Clique em **Publicar app**
3. Se necessario, preencha o formulario de verificacao do Google
4. Para apps simples, a verificacao e rapida (1-3 dias)

---

## Checklist Final

- [ ] SQL executado no Supabase (3 tabelas criadas)
- [ ] Google OAuth configurado (Google Cloud + Supabase)
- [ ] App testado na web (login, materias, timer, relatorios)
- [ ] Icones e splash screens gerados
- [ ] App testado no simulador iOS
- [ ] App testado no emulador Android
- [ ] Conta Google Play Developer criada ($25)
- [ ] AAB gerado e publicado na Play Store
- [ ] Conta Apple Developer criada ($99/ano)
- [ ] Archive feito e publicado na App Store
- [ ] Politica de Privacidade online
- [ ] Google OAuth publicado (modo producao)
