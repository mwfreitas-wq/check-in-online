# Guia de Publicação e Incorporação no Google Sites

## Método 1: Incorporação Única com Roteamento por URL (Recomendado)

1. No Google Sites, adicione um bloco de **"Incorporar" (Embed)** > **"Por código" (Embed code)**.
2. Cole o conteúdo de [index.html](file:///c:/Users/mwfre/.gemini/antigravity/check%20in%20online/index.html).
3. Na hora de gerar o QR Code impresso no balcão de cada hotel, aponte a câmera para as seguintes URLs:
   - **Hit Hotel:** `https://sites.google.com/view/check-in-online-hotor/full-page-embed?hotel=hit`
   - **Hotel Porto Salvador:** `https://sites.google.com/view/check-in-online-hotor/full-page-embed?hotel=salvador`
   - **Hotel Porto das Âncoras:** `https://sites.google.com/view/check-in-online-hotor/full-page-embed?hotel=ancoras`

---

## Método 2: Três Páginas Separadas no Google Sites

Se o seu Google Sites isolar totalmente o iframe e você preferir páginas 100% fixas:

1. Crie 3 subpáginas no seu Google Sites (ex: `/hit`, `/porto-salvador`, `/porto-das-ancoras`).
2. Em cada uma, cole o HTML correspondente da pasta `templates/`:
   - [hit-hotel.html](file:///c:/Users/mwfre/.gemini/antigravity/check%20in%20online/templates/hit-hotel.html)
   - [porto-salvador.html](file:///c:/Users/mwfre/.gemini/antigravity/check%20in%20online/templates/porto-salvador.html)
   - [porto-das-ancoras.html](file:///c:/Users/mwfre/.gemini/antigravity/check%20in%20online/templates/porto-das-ancoras.html)
3. Cada página já vem travada na unidade correta e sem botões administrativos visíveis ao hóspede.

---

## Acesso à Recepção e Espelho do PMS

1. Na parte inferior de qualquer tela existe um link discreto: **"Acesso Recepção"** com cadeado.
2. Digite a senha: `master`
3. A recepção terá acesso:
   - Aos gráficos de BI (Origem por Estado, Países, Canais de Reserva e Horários de Pico).
   - À tabela de check-ins em tempo real.
   - Ao botão **"Espelho PMS"**, que replica visualmente a tela do sistema do hotel e possui botões de 1 clique para copiar Nome, CPF, Fone, Cidade, etc.
   - Ao botão direto de WhatsApp para falar com o hóspede.
   - À exportação completa em Excel/CSV.
