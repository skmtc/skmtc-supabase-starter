# Supabase Starter with Skmtc codegen

Instantly generate typesafe Supabase Edge Functions with Hono and Tanstack Query clients direct from API schema. 
- 🛑 No more API drift
- 🧹 No more cleaning up LLM generated mess
- 🔄 No more manual code updates in 27 places

This repo includes code generators for:
- Frontend: Tanstack React Query hooks, Zod and TypeScript
- Backend: Supabase Edge Functions with Hono, Zod and TypeScript


![Supabase codegen demo](./docs/supabase-demo.mp4)


---

## The problem

When building full-stack apps, you end up writing the same types and validation logic multiple times:

- Define your API endpoints on the server
- Write corresponding TypeScript types for the client  
- Create validation schemas for runtime checks
- Build data fetching hooks for your React components
- Keep everything synchronized when things change

This gets tedious fast, and it's easy for things to drift out of sync.

## How this works

Instead of writing everything multiple times, you define your [API](/api/) once using [TypeSpec](https://typespec.io/) (think OpenAPI but with better TypeScript integration). Then SKMTC generates:

- React Query hooks for data fetching
- Zod schemas for validation
- Supabase Edge Functions with proper typing
- All the TypeScript interfaces you need

When you change your API definition, regenerate the code and everything stays in sync.

## 🚀 Getting started

### Prerequisites
- A Supabase project
- Node.js and pnpm

### Setup
```bash
git clone https://github.com/skmtc/skmtc-supabase-starter
cd skmtc-supabase-starter
pnpm install
```

### Generate your first API
```bash
# Login to Skmtc - first time only
pnpm skmtc login 

# Deploy code generators - first time only
pnpm skmtc deploy

# Generate code from your TypeSpec definitions
pnpm skmtc generate
```

### Add environment variables

Front end: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
Backend: Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `supabase/functions/.env`

### Run the app

```bash
# Start Vite dev server
pnpm dev

# Start Supabase dev server
supabase start
supabase functions serve
```

### See what you get

Check out `api/petstore-dogs.tsp` - it's a simple API definition that becomes:

- 🎯 Typesafe React Query hooks (in `src/`)
- 🛡️ Runtime validation with Zod 
- ⚡ Supabase Edge Functions (in `supabase/functions/`)
- 📝 Full TypeScript types throughout

## 📦 What's included

**Frontend:** React 19, Vite, TanStack Query, TypeScript  
**Backend:** Supabase, Hono (for Edge Functions)  
**Tooling:** ESLint, Prettier, TypeSpec

## Example workflows

Let's say you want to add a new endpoint to get a specific dog:

**1. Edit your API definition:**
```typescript
// api/petstore-dogs.tsp
@get
@route("/dogs/{id}")
op getDog(@path id: string): Dog | NotFound;
```

**2. Regenerate:**
```bash
# Compile TypeSpec to OpenAPI
pnpm build:api

# Run code generators
pnpm skmtc generate
```

If you want to customize the generated code, you can edit the code generators in `.skmtc/`. Be sure to run `pnpm skmtc deploy` to deploy the changes before running `pnpm skmtc generate` again.

## Important notes

- Don't edit files with `*.generated.*` in the name - they get overwritten
- The `.skmtc/` folder contains the code generators, not the generated output
- Run `pnpm build:api` after editing TypeSpec files
- Your generated code lives in `src/` and `supabase/functions/`

## 🛟 Need help?

- 📚 [SKMTC Documentation](https://skmtc.dev/docs)
- 💬 [GitHub Discussions](https://github.com/skmtc/skmtc/discussions)  
- 🐛 [Issues](https://github.com/your-username/skmtc-supabase-starter/issues)

## License

MIT - do what you want with it.

---

If this saves you time, consider starring the repo 🙂