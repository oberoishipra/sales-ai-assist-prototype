# AI Assist for Sales — Hugging Face Edition

No API key needed. Uses Hugging Face free inference endpoint.

## Quick Start
1. Unzip and open folder.
2. Install:
   ```powershell
   npm install
   ```
3. Run locally:
   ```powershell
   npm run dev
   ```
4. Deploy to Netlify:
   - Push to GitHub repo.
   - In Netlify: New site → Import repo.
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
   - No API keys needed.

## Tech
- React + Vite frontend
- Netlify Functions backend
- Hugging Face inference API (Mistral-7B-Instruct)
