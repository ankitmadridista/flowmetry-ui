# Flowmetry UI

React + TypeScript frontend for the Flowmetry invoice management platform.

## Prerequisites

- Node.js 18+
- npm 9+
- Flowmetry API running locally (see [flowmetry-app](../flowmetry-app/README.md))

## Getting started

```bash
npm install
```

Copy the example env file and set your API URL:

```bash
cp .env.local.example .env.local
```

`.env.local`:
```
VITE_API_URL=https://localhost:7130
```

> The dev server proxies `/api/*` to `https://localhost:7130` automatically, so `VITE_API_URL` is only needed for production builds (e.g. Vercel).

## Running locally

```bash
npm run dev
```

Opens at `http://localhost:5173`. The backend API must be running for data to load.

## Running tests

Run all tests once:

```bash
npm test
```

Run in watch mode during development:

```bash
npm run test -- --watch
```

Run a specific file:

```bash
npm run test -- src/invoices/InvoiceListPage.test.tsx
```

The test suite includes both unit tests (Vitest + Testing Library) and property-based tests (fast-check).

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

## Deployment

The UI is deployed on **Vercel**. Set `VITE_API_URL` to the backend's public URL in the Vercel environment variables dashboard.

### Why Vercel for the frontend?

Vercel is purpose-built for static/SPA deployments. It handles CDN distribution, preview deployments per PR, and zero-config Vite support out of the box. The backend lives separately — Vercel has no native support for running .NET processes, so it was never a candidate for the API.

### Why Render for the backend (not Railway or Vercel)?

| | Render | Railway | Vercel |
|---|---|---|---|
| .NET support | Native Docker deploy | Native Docker deploy | No — serverless JS/Edge only |
| Free tier | Yes (with cold starts) | Yes (limited hours/month) | No persistent server |
| Persistent server | Yes | Yes | No |
| Pricing predictability | Good | Can spike on usage | N/A for .NET |

Railway is a solid alternative but its free tier caps compute hours per month, which means the API goes down mid-month on a demo project. Render's free tier runs indefinitely with the tradeoff of cold starts. For a portfolio project that needs to stay live, Render is the more reliable choice.

### Free-tier limitations to be aware of

- **Cold starts**: Render spins down the API after 15 minutes of inactivity. The first request after idle can take 30–60 seconds. This is a free-tier constraint — paid plans keep the service warm.
- **No horizontal scaling**: The free tier is a single instance. Under real load you'd move to a paid plan and add replicas or switch to a container orchestration platform.
- **Neon database**: The Postgres database is on Neon's free tier, which has a compute quota. For production use, a paid Neon plan or a managed RDS instance would be appropriate.

## Project structure

```
src/
  invoices/
    invoices.api.ts          # Typed API client for GET /api/invoices
    InvoiceListPage.tsx      # Page root — owns all filter/sort/page state
    FilterBar.tsx            # Filter form (customer name, status, date range)
    InvoiceTable.tsx         # Sortable invoice table with status badges
    PaginationControls.tsx   # Page navigation and page size selector
    invoices.css             # Component styles
    *.test.tsx / *.test.ts   # Unit tests
    *.property.test.tsx      # Property-based tests
```
