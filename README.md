<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1-yXBAQv1LPyq2Ol_jRWaUF6OlTZDac-s

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy na Vercel

1. **Conecte seu repositório à Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório GitHub
   - A Vercel detectará automaticamente que é um projeto Vite

2. **Configure as variáveis de ambiente:**
   - No painel da Vercel, vá em Settings > Environment Variables
   - Adicione a variável: `GEMINI_API_KEY` com o valor da sua chave da API do Gemini
   - Obtenha sua chave em: https://aistudio.google.com/app/apikey

3. **Deploy:**
   - A Vercel fará o build automaticamente usando o `vercel.json` configurado
   - O build usa: `npm run build`
   - O output será a pasta `dist`

**Nota:** O arquivo `vercel.json` já está configurado com as rotas necessárias para SPA (Single Page Application).
