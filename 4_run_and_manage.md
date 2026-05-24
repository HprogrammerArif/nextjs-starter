# Document 4: Guide on Running and Managing the Project

This guide provides practical instructions for installing dependencies, configuring environment variables, running the development servers, executing tests, and managing database migrations.

---

## 1. Choosing the Right Package Manager

This boilerplate comes with a `package-lock.json` file, which means it was created and tested using **npm**.

### 1.1. Why `yarn install` Failed
When you ran `yarn install` (which uses Yarn v1/Classic), it failed to run the development server with an `ERR_MODULE_NOT_FOUND` error for `@electric-sql/pglite`.
- **Reason**: Yarn v1 does not automatically install **peer dependencies** (packages that another package expects you to have installed). The dev-dependency `@electric-sql/pglite-socket` requires `@electric-sql/pglite` as a peer dependency.
- **npm (v7+) and Bun**: Both of these package managers automatically resolve and install peer dependencies.

### 1.2. The Fix
To fix the installation, you should use **npm** (which is installed by default with Node.js) or **bun**. Run the following commands in your terminal:

```bash
# 1. Clean up the Yarn files and node_modules to prevent conflicts
rm -rf node_modules yarn.lock

# 2. Install using npm (recommended for this boilerplate)
npm install
```

Once installed, you can start the development server using:
```bash
npm run dev
```

---

## 2. Setting Up Environment Variables

Before running the application in a production-like environment, or connecting to external services, you must define your environment variables.

1. Locate the `.env` or `.env.production` files in the root folder.
2. For local development, create a file named `.env.local` (this file is ignored by Git, so your secrets won't be pushed to GitHub).
3. Populate the required keys defined in `src/libs/Env.ts`:

```bash
# Clerk Authentication Keys (Get these from your Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database Connection (Not required for local PGlite, but required for Neon/production)
DATABASE_URL=postgres://user:password@host/db

# Arcjet Security Site Key (Optional for local development)
ARCJET_KEY=ajkey_...
```

---

## 3. Reference of Available Command Scripts

Here is a breakdown of what every script in `package.json` does and when you should run it:

| Command | Purpose | When to Use |
| :--- | :--- | :--- |
| `npm run dev` | Starts local database server (PGlite) and Next.js in dev mode | **Daily development** |
| `npm run build` | Generates a optimized production build of the project | Before deploying to production |
| `npm run build-local` | Builds the project locally using a temporary in-memory DB | To verify the build works locally |
| `npm run start` | Runs the compiled production build locally | To test the production build locally |
| `npm run lint` | Inspects code for style violations and bugs using Oxlint | Before committing code |
| `npm run lint:fix` | Automatically fixes simple linting errors | When `npm run lint` shows fixable warnings |
| `npm run check:types` | Runs the TypeScript compiler check to verify type safety | Before committing/pushing |
| `npm run check:deps` | Runs Knip to locate unused dependencies and files | Periodically, to clean up the codebase |
| `npm run check:i18n` | Inspects translation keys for missing entries | Before deploying if you support multiple languages |
| `npm run test` | Runs unit tests using Vitest | While developing components or utilities |
| `npm run test:e2e` | Runs full browser simulation tests using Playwright | Before major releases or in CI |
| `npm run db:generate` | Creates database migration files from your schemas | After updating `src/models/Schema.ts` |
| `npm run db:migrate` | Applies pending migration files to your database | After generating migrations |
| `npm run db:studio` | Launches Drizzle Studio database visualizer | To browse, edit, or insert data |
| `npm run storybook` | Starts Storybook component playground | To build UI components in isolation |

---

## 4. Managing the Database Schema

When adding features, you will often need to modify the database. Here is the exact sequence to manage migrations:

1. **Modify Schema**: Open `src/models/Schema.ts` and add or modify table definitions. For example, to add a `users` table:
   ```typescript
   import { pgTable, serial, text } from 'drizzle-orm/pg-core';
   
   export const users = pgTable('users', {
     id: serial('id').primaryKey(),
     name: text('name').notNull(),
     email: text('email').unique().notNull(),
   });
   ```
2. **Generate Migration**: Run `npm run db:generate`. Drizzle Kit compares your schema to the existing migrations and outputs a new `.sql` file in `./migrations`.
3. **Apply Migration**: Run `npm run db:migrate` to update your database.
4. **Inspect Tables**: Run `npm run db:studio` and open `https://local.drizzle.studio` to inspect your new table.
