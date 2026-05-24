# Document 3: Next.js Best Practices, Performance & React 19 Guidelines

Writing code in Next.js requires a different approach compared to traditional Single Page Applications (SPAs) like Vite or Create React App. This document outlines best practices, performance secrets, and code standards to master.

---

## 1. Mastering React Server Components (RSC) vs. Client Components

The most fundamental rule of Next.js is that **all components are React Server Components by default**.

| Feature | React Server Component (RSC) | Client Component |
| :--- | :--- | :--- |
| **Where it executes** | Server only | Pre-rendered on server, hydrated on browser |
| **JS bundle size impact** | Zero (0 KB sent to browser) | Sent to browser |
| **Direct DB / API Access** | Yes (can query DB directly) | No (must call `/api` or Server Actions) |
| **React Hooks (`useState`...)** | No | Yes |
| **Interactive Events (`onClick`...)** | No | Yes |

### Best Practice Rules:
1. **Default to Server Components**: Keep components as Server Components by default to maintain a fast initial page load.
2. **Opt-in to Client Components Sparingly**: Use `"use client"` *only* when a component requires interactivity (e.g. state, effects, event handlers) or uses web APIs (like `localStorage` or `window`).
3. **Move Client Components Down the Tree**: Do not place `"use client"` at the top of page files. Keep page files as Server Components. If a page contains a form that needs client-side validation, extract just the form into a component (like `CounterForm.tsx`) with `"use client"` and import it into the Server Component page.

---

## 2. Dynamic Data Fetching and Caching

Next.js has a built-in cache that optimizes fetch requests, database queries, and rendering.

### 2.1. Caching Strategies
- **Force Static Layouts**: Next.js compiles routes statically at build time if they do not perform dynamic actions (like reading headers, search parameters, or cookies). This makes pages load instantly because they are served from a CDN.
- **Dynamic Fetching**: If a page needs real-time data, declare it dynamic:
  ```typescript
  export const dynamic = 'force-dynamic';
  ```
- **Caching Fetch Requests**: If you use the native `fetch()`, Next.js caches the result. If you query the database directly using Drizzle, wrap the function in React's `cache` to avoid duplicate database requests during a single render pass:
  ```typescript
  import { cache } from 'react';
  export const getSubscribers = cache(async () => {
    return db.select().from(subscribers);
  });
  ```

### 2.2. Server Actions (Instead of API Routes)
For mutating database records, use Server Actions. They are typed async functions executed on the server, triggered directly from client forms.
- Declare them by writing `"use server"` inside the function or at the top of a file containing actions.
- Automatically handles CSRF protection.
- Trigger cache revalidations via `revalidatePath('/dashboard')` or `revalidateTag('tag-name')` so the UI updates instantly.

---

## 3. Performance & Optimization Checklist

To keep your Lighthouse score at 100%, follow these guidelines:

### 3.1. Images
**Never** use HTML `<img>` tags. Always use Next.js's `<Image />` component.
- **Why**: It automatically resizes images, compresses them into modern formats (WebP/AVIF), prevents Layout Shift (CLS) by requiring width and height, and lazy-loads them when they enter the viewport.

### 3.2. Link Prefetching
Use the Next.js Link component:
```typescript
import Link from 'next/link';
```
- **Why**: Next.js automatically prefetches linked pages in the background when a `<Link>` enters the user's viewport. When the user clicks the link, the transition feels instantaneous because the page is already loaded.

### 3.3. Font Optimization
Instead of fetching fonts from Google CDN at runtime (which blocks rendering), import your fonts using `next/font/google` in your layout file:
```typescript
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```
- **Why**: Next.js downloads the font files at build time and hosts them on your own domain, preventing layout shifts and network requests.

---

## 4. React 19 & Compiler Rules

This boilerplate uses **React 19** and the **React Compiler**.

- **No more `useMemo` or `useCallback`**: The React Compiler automatically determines when to memoize components, component props, and dependency arrays. Do not write manual memoization wrappers.
- **Action State Management**: Use React 19's `useActionState` (replacing `useFormState`) and `useFormStatus` hooks to manage submission loading spinners and server validation errors cleanly without manual state variables.

---

## 5. Coding Conventions of this Boilerplate

To keep the codebase uniform, follow these guidelines:

- **Named Exports Only**: Never use default exports except for Next.js routing entrypoints (`page.tsx`, `layout.tsx`, `template.tsx`).
- **Absolute Imports**: Always import using the `@/` prefix (e.g. `@/components/Button` instead of `../../components/Button`).
- **Zod Imports**: Always use the type-only import syntax for Zod:
  ```typescript
  import type * as z from 'zod';
  ```
- **Localization Constraint**: Never hard-code user-visible strings in components. Keep them in `src/locales/en.json` and retrieve them using the `useTranslations` hooks.
- **Environment Variables**: Never call `process.env.VARIABLE` in your code directly. Import the validated config object from `src/libs/Env` instead:
  ```typescript
  import { Env } from '@/libs/Env';
  console.log(Env.DATABASE_URL);
  ```
