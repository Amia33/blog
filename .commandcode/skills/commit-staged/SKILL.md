---
name: commit-staged
description: Create signed Conventional Commits from the current branch’s staged changes, grouping unrelated changes into separate commits. Use when I ask to commit staged changes, make commits, or commit my work using Conventional Commits.
disable-model-invocation: true
---

# Commit Staged Changes

Create one or more signed commits from the current branch’s intended changes. Do not push, amend, rebase, or commit unrelated work.

## Workflow

1. Inspect the branch and working tree before changing the index:
   - Run `git status --short --branch`.
   - Inspect `git diff --cached` and `git diff` (including untracked paths) to understand exactly what is staged and changed.
   - Treat all pre-existing work as owned by the current checkout. Never discard, overwrite, or silently omit it.
2. Choose the input set:
   - If changes are already staged, commit only the staged changes. Leave unstaged and untracked changes untouched.
   - If nothing is staged and there are changes, use all current tracked and untracked changes as the input. Stage them with `git add -A` only after confirming the exact files and diff; do not include ignored files or repository-external data.
   - If there are no changes, stop and report that there is nothing to commit.
3. Check that Git has a configured signing key with `git config --get user.signingkey`. If it is missing or empty, stop and ask for signing to be configured; do not create unsigned commits or change Git configuration. Sign every commit with `git commit -S` so Git uses the configured signing key.
4. Review the selected diff and group changes by distinct purpose. Make separate commits for unrelated concerns. Keep related changes together. For each group, stage only that group, and ensure no unstaged content from the same file is accidentally included. Never use `git commit <paths>` as a shortcut because it can commit working-tree content outside the index.
5. Write a Conventional Commit message for each group using `<type>[optional scope][!]: <description>`. Use an appropriate type such as `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, or `chore`. Use imperative, concise descriptions; add a `BREAKING CHANGE:` footer when needed. Follow the specification at https://www.conventionalcommits.org/en/v1.0.0/.
6. Create each commit with `git commit -S -m "<message>"`. Do not skip hooks with `--no-verify` or equivalent.
7. If a pre-commit hook fails, inspect its output and resulting working-tree/index changes. Fix the underlying issue, review any hook edits, stage only intended changes, rerun the hook through a normal signed commit, and verify the final diff. Never overwrite unrelated user changes or stage generated/automatic edits without reviewing them. If the failure cannot be resolved safely, stop and report it.
8. After each commit, verify its signature with `git verify-commit HEAD`, inspect the commit with `git show --stat --oneline --decorate HEAD`, and confirm remaining changes with `git status --short`. For multiple groups, continue only with the remaining intended changes and sign and verify each commit separately.
9. Report the commit hashes and messages, whether signature verification succeeded, and any changes left uncommitted. Never push unless separately asked.

## Safety boundaries

- Do not commit when the signing key is unavailable or signing/verification fails.
- Do not change Git signing settings, user configuration, or hooks to make a commit succeed.
- Do not amend existing commits or alter commit history.
- Do not stage unrelated files, secrets, ignored files, or changes that appeared after inspection.
- If staged and unstaged edits overlap in a way that cannot be separated confidently, stop and ask before proceeding.
