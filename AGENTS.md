# Agent Guidelines

## Code Style & Refactoring

- Follow **DRY**, **KISS**, and **SOLID** principles when writing or refactoring code.
- Prefer **clarity over cleverness**. Optimize for code that is easy to understand, maintain, and modify.
- Keep functions focused and reasonably short:
  - Give functions and variables descriptive, unambiguous names.
  - Prefer readable control flow over compressed or overly clever implementations.
  - Follow the **Single Responsibility Principle (SRP)**: each function should have one clear purpose.
- Avoid unnecessary abstractions, premature optimization, and unrelated refactoring.
- Match the existing project's conventions, architecture, and patterns before introducing new ones on the module you are working.
- Use the appropriate comment syntax for the file type (`//`, `#`, `<!-- -->`, etc.).
- Write comments only when they add useful context that cannot be expressed clearly through the code itself.
- **Preserve existing comments.** If additional context is needed, add a new line rather than replacing or rewriting a previous agent's comment.
- Reuse existing utilities, helpers, components, and abstractions when appropriate rather than duplicating functionality.
- Prefer creating new components instead of raw html when needed.

## UI Style

- Preserve the existing application's **color palette, typography, spacing, layout patterns, and visual language**.
- Before creating a new UI component, check whether an existing component can be reused or extended.
- Prefer existing design-system components and established patterns to keep the UI consistent.
- Do not introduce new visual patterns, colors, or component variants without a clear reason.
- Keep new UI cohesive with the surrounding application rather than treating each feature as a standalone design.

## Testing

- Write or update tests for every new implementation or behavior change.
- Prefer tests that verify **observable behavior** rather than implementation details.
- Run the most relevant test suite after making changes.
- Run the **full relevant test suite** before considering the task complete.
- Do not move on to another task or commit changes while relevant tests are failing.
- If a test cannot be made to pass, **do not silently skip it**. Document the failure, its cause if known, and what remains to be fixed.
- When fixing a bug, add a regression test whenever practical.

## Definition of Done

Before considering a task complete:

1. The implementation follows the existing project's conventions and architecture.
2. New or changed behavior has appropriate test coverage.
3. Relevant tests have been run and pass.
4. No unrelated changes or unnecessary refactoring have been introduced.
5. The final diff has been reviewed for correctness, clarity, and accidental changes.
6. Changes are committed with an appropriate conventional commit message.

### Commit Style

Use the following conventional commit prefixes:

- `feat`: A new user-facing feature.
- `fix`: A user-facing bug fix.
- `docs`: Documentation-only changes.
- `style`: Formatting or stylistic changes that do not affect production behavior.
- `refactor`: Production-code restructuring that does not change behavior.
- `test`: Adding or modifying tests without changing production behavior.
- `chore`: Maintenance or tooling changes that do not fit the categories above.

### Commit Guidelines

- Use the most specific applicable prefix.
- Write commit messages in the imperative mood.
- Keep the subject concise and specific.
- Explain the **why** in the commit body when the change is non-trivial.
- Do not create a commit until the relevant tests pass.

Example:

```
feat(user-profile): add user profile editing

Allow users to update their profile information from the
account settings page.
```
