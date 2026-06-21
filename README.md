# Buildanta Material Helper

**Buildanta Material Helper** is a modern, responsive full-stack Next.js 15 application designed to help first-time homebuilders in Kanpur, Uttar Pradesh, India, make informed decisions when procuring construction materials (e.g., Cement, TMT Bars, Coarse Sand, Tiles).

Leveraging the OpenAI SDK, the application queries GPT-4o-mini to return **3 localized quality assurance checks** for any input material, taking into account Kanpur's regional construction conditions (such as Gangetic silt soil, groundwater salinity, monsoons, and local supply considerations).

---

## Features

- **Material Quality Checklist**: Instantly fetch a tailored 3-point inspection guide for any material.
- **Kanpur Localized Context**: Safety recommendations are customized for local Indian standards and Kanpur environment parameters.
- **Auto-Suggestions**: Quick click filters for popular construction materials.
- **Premium Glassmorphic UI**: Beautiful dark-theme design utilizing Tailwind CSS v4, smooth micro-animations, loading loaders, and responsive layouts.
- **Graceful Error Recovery**: Actionable alerts that guide you through missing API keys or network errors without crashing the app.

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Import the project into your Vercel Dashboard.
3. In the Vercel project configuration, add your Environment Variable:
   - Key: `OPENAI_API_KEY`
   - Value: `your_actual_openai_api_key`
4. Click **Deploy**. Vercel will automatically compile and serve the project.
