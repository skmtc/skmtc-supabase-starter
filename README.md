# Supabase Starter with Skmtc codegen

A TypeScript starter that generates your client and server code from a single API definition.

If you're building with Supabase and tired of keeping types in sync between your frontend and backend, this might help.

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

Instead of writing everything multiple times, you define your API once using [TypeSpec](https://typespec.io/) (think OpenAPI but with better TypeScript integration). Then SKMTC generates:

- React Query hooks for data fetching
- Zod schemas for validation
- Supabase Edge Functions with proper typing
- All the TypeScript interfaces you need

When you change your API definition, regenerate the code and everything stays in sync.

## 🚀 Getting started

### Prerequisites
- A Supabase project with your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Node.js and pnpm

### Setup
```bash
git clone https://github.com/your-username/skmtc-supabase-starter
cd skmtc-supabase-starter
pnpm install

# Add your Supabase credentials
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Generate your first API
```bash
# First time setup
pnpm run skmtc deploy

# Generate code from your TypeSpec definitions
pnpm run skmtc generate

# Start the dev server
pnpm run dev
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

## Example workflow

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
pnpm run skmtc generate
```

**3. Use it in React:**
```tsx
import { useGetDog } from './generated.hooks'

function DogProfile({ dogId }: { dogId: string }) {
  const { data: dog, isLoading } = useGetDog({ id: dogId })
  
  if (isLoading) return <div>Loading...</div>
  if (!dog) return <div>Dog not found</div>
  
  return <div>{dog.name} is a {dog.breed}</div>
}
```

The server-side handler is automatically generated and deployed as a Supabase Edge Function.

## Important notes

- Don't edit files with `*.generated.*` in the name - they get overwritten
- The `.skmtc/` folder contains the code generators, not the generated output
- Run `pnpm run build:api` after editing TypeSpec files
- Your generated code lives in `src/` and `supabase/functions/`

## 🛟 Need help?

- 📚 [SKMTC Documentation](https://skmtc.dev/docs)
- 💬 [GitHub Discussions](https://github.com/skmtc/skmtc/discussions)  
- 🐛 [Issues](https://github.com/your-username/skmtc-supabase-starter/issues)

## License

MIT - do what you want with it.

---

If this saves you time, consider starring the repo 🙂