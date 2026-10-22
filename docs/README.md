# FastCheck-in & BI Hoteleiro

Sistema unificado de **Check-in Digital (FNRH)** e **Business Intelligence (BI)** para as unidades:
- 🏖️ **Hit Hotel** (Salvador - BA)
- ⚓ **Hotel Porto Salvador** (Salvador - BA)
- 🌴 **Hotel Porto das Âncoras** (Porto Seguro - BA)

---

## 📁 Estrutura de Pastas do Projeto

```text
check in online/
├── index.html                   # Aplicação Completa Standalone (Pronta para uso direto e GitHub Pages)
├── google-sheets-script.js      # Script pronto para colar no Google Apps Script (integração Planilhas)
│
├── assets/
│   ├── css/
│   │   └── styles.css           # Estilos customizados, scrollbars e layout do PMS
│   └── js/
│       ├── config.js            # Configuração dos hotéis, rotas e constantes
│       ├── i18n.js              # Suporte a 4 idiomas (PT, ES, EN, FR)
│       ├── mock-data.js         # Base de dados de check-ins e histórico
│       └── app.js               # Lógica de negócio, validações, gráficos e BI
│
├── templates/                   # Versões HTML fixas dedicadas por hotel (Modo Hóspede 100% limpo)
│   ├── hit-hotel.html           # Exclusivo Hit Hotel
│   ├── porto-salvador.html      # Exclusivo Hotel Porto Salvador
│   └── porto-das-ancoras.html   # Exclusivo Hotel Porto das Âncoras
│
└── docs/
    ├── README.md                # Este manual técnico
    ├── guia-google-planilhas.md # Passo a passo para salvar os dados no Google Planilhas
    ├── guia-github-pages.md     # Passo a passo completo para hospedar no GitHub Pages
    └── guia-google-sites.md     # Instruções de incorporação legada (Google Sites)
```

---

## 🔑 Credenciais e Acessos

- **Área Administrativa & Barra de Controle:** Protegida por senha.
  - **Senha padrão:** `master`
  - **Comportamento Padrão:** A barra superior escura de controle (com seletor de hotel, simulações, BI e QR codes) fica **100% OCULTA** quando o site é aberto por hóspedes ou por leitura de QR Code.
  - **Como Acessar:** No rodapé da página (ou no voucher pós-check-in), clique no cadeado discreto **"Acesso Recepção"** e digite a senha `master`. Ao autenticar, a barra e o painel de BI/QR Codes são liberados.
  - **Como Sair:** Ao clicar no botão vermelho **"Sair"**, o painel é bloqueado e a barra volta a ficar completamente oculta.

---

## 🌐 Roteamento dos QR Codes para Cada Hotel

Cada QR Code direciona o hóspede exclusivamente para a respectiva página do hotel, sem exibir qualquer menu ou botão administrativo:

- 🏖️ **Hit Hotel:** `https://sites.google.com/view/check-in-online-hotor/full-page-embed?hotel=hit`
- ⚓ **Hotel Porto Salvador:** `https://sites.google.com/view/check-in-online-hotor/full-page-embed?hotel=salvador`
- 🌴 **Hotel Porto das Âncoras:** `https://sites.google.com/view/check-in-online-hotor/full-page-embed?hotel=ancoras`
