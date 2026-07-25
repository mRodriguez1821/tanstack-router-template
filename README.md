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

## Commit Style

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)
