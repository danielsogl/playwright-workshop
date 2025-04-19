# Technical Context

## Technology Stack

- **Frontend Framework**: Next.js with App Router
- **UI Library**: HeroUI components & Tailwind CSS v4
- **Authentication**: NextAuth.js
- **State Management**: React Hooks + Context API (via NextAuth SessionProvider)
- **Data Fetching**: SWR for client-side data fetching
- **Input Validation**: Zod
- **Password Hashing**: bcryptjs
- **Unique IDs**: uuid
- **RSS Parsing**: RSS Parser library (Planned, not yet installed)
- **Development Tools**: TypeScript, ESLint, Prettier

## Development Environment

- Next.js dev server
- In-memory data store (no external database required)
- JSON configuration files
- TypeScript for type safety

## Dependencies

- Next.js 15+ (`next`)
- NextAuth.js (`next-auth`)
- HeroUI components (`@heroui/*` - button, code, input, kbd, link, listbox, navbar, snippet, switch, system, theme, card, divider, spinner)
- Tailwind CSS v4 (`tailwindcss`, `autoprefixer`, `postcss`)
- Tailwind Variants (`tailwind-variants`)
- SWR (`swr`)
- Zod (`zod`)
- bcryptjs (`bcryptjs`, `@types/bcryptjs`)
- uuid (`uuid`, `@types/uuid`)
- Utility libraries (`clsx`, `framer-motion`, `intl-messageformat`, `@react-aria/ssr`, `@react-aria/visually-hidden`)
- TypeScript (`typescript`, `@types/*`)
- Linting/Formatting (`eslint`, `prettier`, various plugins)
- Git Hooks (`husky`, `lint-staged`)
