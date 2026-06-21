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

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (PostCSS)
- **API**: Next.js Route Handlers
- **AI Engine**: OpenAI Node SDK (`gpt-4o-mini`)
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

Make sure you have Node.js installed:
- Node.js version `v18.18.0` or higher (this project was initialized using `v24.17.0`)
- npm `v10.x` or higher

### Installation

1. Clone or copy the project files to your directory.
2. Install the dependencies in the root directory:
   ```bash
   npm install
   ```

### Configuration

The backend API route requires an OpenAI API Key.

1. Locate the `.env.local` file in the root directory (a template has been generated for you).
2. Replace `YOUR_OPENAI_API_KEY` with your actual secret key:
   ```env
   OPENAI_API_KEY=sk-proj-yourActualSecretKeyHere...
   ```
   *Note: Your key is kept secure server-side and is never exposed to the client browser.*

---

## Running the Application

### Development Server

Run the development server locally:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

To verify and test compile the production build:
```bash
npm run build
```

To run the compiled production bundle locally:
```bash
npm run start
```

---

## Deployment (Vercel)

This application is fully production-ready and optimized for deployment on **Vercel**:

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Import the project into your Vercel Dashboard.
3. In the Vercel project configuration, add your Environment Variable:
   - Key: `OPENAI_API_KEY`
   - Value: `your_actual_openai_api_key`
4. Click **Deploy**. Vercel will automatically compile and serve the project.
