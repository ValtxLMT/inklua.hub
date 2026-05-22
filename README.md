# InKlua — Pitch Site

> Inclusão Inteligente para Empresas

## 🚀 Deploy no Render

1. Suba este projeto em um repositório no GitHub
2. Acesse [render.com](https://render.com) e clique em **New → Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Clique em **Create Web Service**

O Render vai detectar o `package.json` automaticamente e a URL ficará disponível em minutos.

## 📁 Estrutura

```
inklua/
├── server.js        # Backend Express
├── package.json     # Dependências
├── public/
│   └── index.html   # Site completo (frontend)
└── README.md
```

## ✏️ Adicionando o Adlib

Quando tiver o adlib pronto, procure no `index.html` o bloco:

```html
<!-- ADLIB PLACEHOLDER -->
<div id="adlib">
```

E substitua o conteúdo interno pelo iframe do vídeo ou apresentação.

## 🛠 Rodar localmente

```bash
npm install
npm start
# Acesse: http://localhost:3000
```
