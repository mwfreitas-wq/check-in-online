# Passo a Passo: Conectar o FastCheck-in ao Google Planilhas

Ao conectar o sistema com o **Google Planilhas**, todos os cadastros feitos pelos hóspedes no celular cairão automaticamente como novas linhas em uma planilha no seu Google Drive, e a recepção poderá visualizá-los e sincronizá-los em tempo real!

---

## ⏱️ Tempo estimado: 3 minutos

---

### Passo 1: Criar a Planilha no Google Drive
1. Acesse o [Google Drive](https://drive.google.com/) ou [Google Sheets](https://sheets.new) com a conta Google do hotel.
2. Crie uma nova planilha em branco e dê um nome (por exemplo: `Check-ins Hotéis - Oficial`).

---

### Passo 2: Abrir o Editor de Apps Script
1. Na sua nova planilha, clique no menu superior: **`Extensões`** > **`Apps Script`**.
2. Uma nova aba será aberta com um editor de código.
3. Apague todo o conteúdo que estiver na tela (apague `function myFunction() { ... }`).
4. Abra o arquivo **`google-sheets-script.js`** que está na pasta do seu projeto, copie **todo o código** e cole dentro do editor do Google.
5. Clique no ícone de **Disquete (Salvar)** no topo do editor.

---

### Passo 3: Implantar como Aplicativo da Web (Web App)
1. No canto superior direito do Apps Script, clique no botão azul **`Implantar`** (Deploy) > **`Nova implantação`** (New deployment).
2. Clique no ícone de **Engrenagem** ao lado de "Selecione o tipo" e escolha **`App da Web`** (Web app).
3. Preencha os campos exatamente assim:
   - **Descrição:** `API Check-in Hotel`
   - **Executar como:** `Eu (seu-email@gmail.com)`
   - **Quem tem acesso:** `Qualquer pessoa` (Anyone)  *(Importante: deve ser "Qualquer pessoa" para que o celular do hóspede consiga enviar os dados sem pedir login do Google).*
4. Clique no botão azul **`Implantar`**.
5. Se o Google solicitar permissões:
   - Clique em **Autorizar acesso** e selecione sua conta.
   - Clique em **Avançado** > **Acessar API Check-in Hotel (não seguro)**.
   - Clique em **Permitir**.
6. O Google exibirá a tela com a **URL do app da Web** (começa com `https://script.google.com/macros/s/.../exec`).
7. Clique em **Copiar** nessa URL.

---

### Passo 4: Conectar a URL no seu Sistema de Recepção
1. Abra o seu site (no GitHub Pages ou localmente no navegador).
2. No rodapé, clique em **`Acesso Recepção`** e digite a senha: `master`.
3. Na barra verde de status da planilha, clique em **`Configurar Link da Planilha`**.
4. Cole a URL do Web App que você copiou no campo e clique em **`Salvar e Conectar`**.
5. Pronto! O sistema exibirá o status **Conectado**!

---

### Passo 5: Testar na Prática
1. Acesse a tela do formulário do hóspede (ou simule um check-in).
2. Preencha os dados e clique em **`Confirmar Check-in Online`**.
3. Abra a sua planilha do Google Drive: a aba **"Checkins"** terá sido criada automaticamente com os dados do hóspede organizados em colunas com cabeçalho colorido!
4. Na tela da Recepção, clique em **`Sincronizar com a Planilha`** para puxar e atualizar todos os dados em tempo real.
