# Passo a Passo: Publicar no GitHub Pages & Atualizar QR Codes

O **GitHub Pages** é a melhor opção para este sistema:
- ✅ **Sem janelas/iframes isolados** (ao contrário do Google Sites, que bloqueava parâmetros de URL).
- ✅ **100% Gratuito**, rápido e com certificado de segurança **HTTPS** incluso.
- ✅ **Roteamento nativo:** a leitura do QR Code no celular abre imediatamente o hotel correto.

---

## Passo 1: Criar o Repositório no GitHub

1. Acesse [github.com](https://github.com/) e faça login na sua conta.
2. No canto superior direito, clique no botão **`+`** e selecione **`New repository`**.
3. Preencha os campos:
   - **Repository name:** `check-in-online` (ou outro nome de sua preferência).
   - **Public / Private:** Selecione **`Public`** (o GitHub Pages gratuito exige que seja público).
   - Deixe as outras opções desmarcadas.
4. Clique em **`Create repository`**.

---

## Passo 2: Enviar os Arquivos do Projeto

Você pode enviar os arquivos pelo próprio navegador ou pelo terminal:

### Opção A: Pelo Navegador (Mais Fácil)
1. Na página do repositório recém-criado, clique no link **`uploading an existing file`**.
2. Abra a pasta do seu computador:
   `C:\Users\mwfre\.gemini\antigravity\check in online`
3. Arraste todos os arquivos e pastas para dentro da janela do navegador:
   - `index.html`
   - pasta `assets`
   - pasta `templates`
   - pasta `docs`
4. Na parte inferior, clique em **`Commit changes`**.

### Opção B: Pelo Terminal / Git (Se já tiver o Git instalado)
Execute na pasta do projeto:
```powershell
git init
git add .
git commit -m "Publicação inicial do FastCheck-in"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/check-in-online.git
git push -u origin main
```

---

## Passo 3: Ativar o GitHub Pages

1. No repositório no GitHub, clique na aba **`Settings`** (ícone de engrenagem no topo).
2. No menu lateral esquerdo, clique em **`Pages`** (dentro da seção *Code and automation*).
3. Em **Build and deployment**:
   - **Source:** selecione **`Deploy from a branch`**.
   - **Branch:** selecione **`main`** e a pasta **`/(root)`**.
   - Clique em **`Save`**.
4. Aguarde cerca de 1 a 2 minutos e recarregue a página. O GitHub exibirá o endereço oficial publicado:
   `https://SEU-USUARIO.github.io/check-in-online/`

---

## Passo 4: Como Mudar o Endereço dos QR Codes

Agora que o site está no ar, você atualiza os QR Codes em segundos:

1. Abra o seu site no navegador: `https://SEU-USUARIO.github.io/check-in-online/`
2. Role até o rodapé e clique em **`Acesso Recepção`** (ícone de cadeado).
3. Digite a senha: `master`
4. Clique na aba **`Plaquinhas QR Code`**.
5. No painel de configuração:
   - **Detecção Automática:** Basta clicar no botão **"Detectar URL Atual"**. O sistema identifica sozinho que está rodando no GitHub Pages!
   - Ou digite manualmente no campo: `https://SEU-USUARIO.github.io/check-in-online/`
   - Clique em **`Atualizar os 3 QR Codes`**.
6. Pronto! Os 3 QR Codes são atualizados na hora com as URLs oficiais:
   - 🏖️ **Hit Hotel:** `https://SEU-USUARIO.github.io/check-in-online/?hotel=hit`
   - ⚓ **Porto Salvador:** `https://SEU-USUARIO.github.io/check-in-online/?hotel=salvador`
   - 🌴 **Porto das Âncoras:** `https://SEU-USUARIO.github.io/check-in-online/?hotel=ancoras`

---

## Passo 5: Baixar ou Imprimir as Plaquinhas

Em cada cartão de QR Code na recepção:
- Clique em **`PNG`** para salvar a imagem do QR Code em alta resolução.
- Clique em **`Imprimir Plaquinha`** para gerar a folha impressa pronta para o balcão.
- Clique em **`Testar Link do Hotel`** para simular como o hóspede abre a página no celular.
