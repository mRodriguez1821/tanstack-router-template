## Folder Structure

```bash
src/
├── components/ # global components
│   ├── ui/  # Shadcn (or other library) components
│   │  └── index.ts
│   └── index.ts
├── lib/
│   ├── types.ts  # global types
│   ├── i18n.ts  # global translations
│   ├── http-methods.ts # HTTP methods such as POST, GET, PUT, PATCH
│   ├── tanstack-hooks.ts # helpers for common queries and mutations with tanstack query
│   ├── constants.ts
│   └── utils.ts
└── routes/
    ├── __root.tsx
    ├── (auth)/
    │   └── signin.tsx
    └── (app)/
        └── (users)/
            ├── -stories/
            │   └── users-page.stories.tsx
            ├── -hooks/
            │   └── index.ts
            ├── -schemas/
            │   └── index.ts
            ├── -components/
            │   └── index.ts
            ├── -lib/
            │   ├── types.ts
            │   ├── constants.ts
            │   ├── utils.ts
            │   ├── api.ts # Api calls functions
            │   └── mocks.ts
            ├── users.index.tsx
            └── users.$userId.tsx
```
