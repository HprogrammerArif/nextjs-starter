# Document 2: Tools & Packages Deep Dive

To extract 100% of the value from this boilerplate, you need to understand the tools and libraries configured within it. This guide covers how these packages work, how they are configured, and how to utilize them.

---

## 1. Database Layer: Drizzle ORM, Postgres, & PGlite

This boilerplate relies on a modern database stack designed for fast local iteration and scalable cloud deployments.

### 1.1. Drizzle ORM
Drizzle is a TypeScript-first ORM. It provides query helpers, raw SQL injection options, and a schema generator.
- **Location of Schema**: `src/models/Schema.ts`.
- **Database Connection**: `src/libs/DB.ts` creates a singleton database instance (`db`) using a Postgres client. It caches this connection globally in development to prevent hot-reload resource leaks.
- **Drizzle Kit**: The developer CLI tool.
  - `npm run db:generate`: Analyzes changes in `Schema.ts` and writes SQL migrations.
  - `npm run db:migrate`: Applies migrations to your database.
  - `npm run db:studio`: Runs a lightweight visual dashboard locally (`https://local.drizzle.studio`) to browse, filter, edit, and insert table rows.

### 1.2. PGlite vs. Neon Postgres
- **PGlite**: An in-memory, single-file Postgres engine compiled to WebAssembly. This allows the local server to run a full Postgres database entirely inside a file (`local.db`) or in RAM, eliminating the need to install Postgres locally or set up Docker containers during development.
- **Neon Postgres**: A fully managed serverless Postgres provider. Perfect for production.
- **Configuration**: Regulated through the `DATABASE_URL` environment variable.

---



## 3. Localization: next-intl & Crowdin

Multi-language support is baked into the routing layer.

- **Routing and Middleware**: Next.js App Router leverages subfolders like `[locale]` to track language. `next-intl` maps paths (`/en/about`, `/fr/about`) to static resources automatically.
- **Development**:
  - You write translations inside `src/locales/en.json`.
  - When utilizing translations in components, Server Components use `getTranslations` and Client Components use `useTranslations`.
  - Missing or extra translation keys are automatically validated via the custom check command: `npm run check:i18n`.
- **Crowdin Sync**: Crowdin translates your `en.json` file into other language JSONs. This boilerplate contains GitHub actions configured to push your `en.json` to Crowdin and fetch other languages automatically on commits to the `main` branch.

--- 

## 4. Security & Bot Detection: Arcjet

Arcjet protects your Next.js application by applying rate limits, bot detection, and Web Application Firewall (WAF) protections at the edge.

- **Shield WAF**: Configured in `src/libs/Arcjet.ts` to detect malicious query strings, SQL injection, and XSS attacks.
- **Bot Detection**: Integrated into the `src/proxy.ts` middleware. It blocks scrapers, crawlers, and AI agents while allowing search engines (like Google), OG image link previewers, and uptime monitoring tools.
- **Setup**: You must supply an `ARCJET_KEY` in your environment variables to enable protection.

---

## 5. Development Speed, Code Quality, and Linting

Rather than standard ESLint and Prettier, this project uses ultra-fast Rust-based alternatives:

- **Oxlint & Oxfmt**: These tools lint and format code in milliseconds.
  - `npm run lint`: Runs code analysis to detect potential runtime bugs and formatting deviations.
  - `npm run lint:fix`: Automatically formats and resolves code warnings.
- **Lefthook**: A high-performance Git Hooks manager that runs linters and formatter pre-commits to keep bad code out of the repository.
- **Knip**: Unused code and file checker. Run `npm run check:deps` to identify files, packages, variables, or types that are imported but never used.

---

## 6. Testing Suite

The testing layout provides both fast unit tests and accurate end-to-end user tests.

- **Vitest**: Runs fast unit tests (`*.test.ts` or `*.test.tsx`) in memory. Supports browser mode for UI components.
  - `npm run test`: Executes unit tests.
- **Playwright**: Automates full browser actions for End-to-End (`*.e2e.ts`) and Integration tests (`*.integ.ts`).
  - `npm run test:e2e`: Opens headless Chrome/Firefox/WebKit instances to click buttons, fill forms, and assert database modifications.
- **Storybook**: A visual canvas for modular component development. Stories are colocated with components (`BaseTemplate.stories.tsx`). Test story components locally using `npm run storybook:test`.

---

## 7. Performance & Telemetry

- **Sentry**: Captures code crashes, unhandled promises, and slow database calls in real-time. Spotlight displays these errors in development via an interactive dashboard at `http://localhost:8969`.
- **LogTape & Better Stack**: Structured logging. Standard logs are sent to the terminal, while production logs are posted asynchronously to Better Stack, where they can be queried using SQL.
- **Checkly**: Periodically verifies page availability, ensuring your production server remains up and running worldwide.
- **PostHog**: Tracks custom user behaviors and metrics in your app to analyze conversion funnels.

---

Move on to **Document 3** to explore Next.js Best Practices and Performance optimization patterns.
