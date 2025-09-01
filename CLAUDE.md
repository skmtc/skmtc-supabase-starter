# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Vite development server
- `npm run build` - TypeScript compilation + Vite production build  
- `npm run lint` - Run ESLint for code quality
- `npm run skmtc` - Run SKMTC code generation tool
- `npm run build:api` - Compile TypeSpec API definitions
- `npm run format:api` - Format TypeSpec files
- `npm run lint:api` - Lint TypeSpec API files

## Architecture Overview

This is a **type-driven full-stack TypeScript application** using a code generation workflow:

### Tech Stack
- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Supabase (BaaS) + Edge Functions (Hono)
- **API Layer**: TypeSpec → OpenAPI → Generated Code
- **Data Fetching**: TanStack Query with generated client
- **Validation**: Zod schemas (generated)

### Code Generation Workflow (SKMTC)
1. **Define APIs** in TypeSpec files (`/api/` folder)
2. **Compile TypeSpec to OpenAPI** with `npm run build:api`
3. **Deploy all generators on first use** with `npm run skmtc deploy`
3. **Run all generators** with `npm run skmtc generate`
3. **Code generators** live in `/.skmtc/` directory
4. **Generated code** is written to:
   - `src/` - Frontend code with `*.generated.*` filename pattern
   - `supabase/functions/` - Backend edge functions with `*.generated.*` filename pattern

### Key Directories
- `src/` - React application source code (includes generated `*.generated.*` files)
- `api/` - TypeSpec API definitions (source of truth)
- `supabase/functions/` - Edge functions (includes generated `*.generated.*` files)
- `.skmtc/` - Code generators

## Development Workflow

1. **API Changes**: Edit TypeSpec files in `/api/`, then run `npm run build:api`
2. **Frontend Changes**: Work in `/src/` with full type safety from generated clients
3. **Backend Changes**: Generated Hono server code in `/supabase/functions/`

## Important Notes

- **Never edit generated code** with `*.generated.*` filename pattern - changes will be overwritten
- **Always regenerate** after API spec changes: `npm run build:api` or `npm run skmtc`
- **TypeScript paths**: `@/*` maps to `./src/*` in frontend and `./supabase/functions/*` in backend
- **Environment variables**: Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Deno runtime** used for Supabase functions (configured in `supabase/deno.json`)