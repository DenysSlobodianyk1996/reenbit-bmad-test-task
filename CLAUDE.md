# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BMAD-METHOD is an AI-driven agile development framework that provides specialized agents ("skills") for structured workflows. The project is distributed as an npm package (`bmad-method`) with an interactive CLI installer.

## Common Commands

```bash
# Install dependencies
npm install

# Run all quality checks (used in CI)
npm run quality

# Run tests
npm run test              # All tests: refs, install, lint, md, format
npm run test:install      # Installation component tests
npm run test:refs         # File reference CSV tests

# Validation
npm run validate:refs     # Validate file references (--strict for CI)
npm run validate:skills   # Validate skill definitions (--strict for CI)

# Linting and formatting
npm run lint              # ESLint for JS/YAML
npm run lint:fix          # Auto-fix lint issues
npm run lint:md           # Markdown linting
npm run format:check      # Check Prettier formatting
npm run format:fix        # Auto-fix formatting

# Documentation site (Astro + Starlight)
npm run docs:dev          # Start dev server
npm run docs:build        # Build for production
npm run docs:preview      # Preview production build
npm run docs:validate-links
npm run docs:fix-links

# CLI (local development)
node tools/installer/bmad-cli.js install
node tools/installer/bmad-cli.js uninstall
node tools/installer/bmad-cli.js status
```

## Architecture

### Module and Skill Structure

Skills are organized in modules under `src/`:

- **`src/core-skills/`** — Foundation skills (help, party-mode, distillator, editorial reviews, etc.)
- **`src/bmm-skills/`** — BMad Method workflow skills organized by phase:
  - `1-analysis/` — Research, PRFAQ, product brief, document project
  - `2-plan-workflows/` — Create PRD, UX design, architecture, epics/stories
  - `3-solutioning/` — Brainstorming, design thinking, etc.
  - `4-implementation/` — Dev story, code review, sprint planning, retrospective

Each skill is a directory containing:
- `SKILL.md` — Skill definition with YAML frontmatter (name, description) + markdown instructions
- Optional subdirectories for templates or supporting files

Module configuration:
- `module.yaml` — Module metadata, prompts for installation-time configuration variables
- `module-help.csv` — Catalog of all skills with metadata (menu codes, phases, dependencies, output locations)

### Installer Architecture

The CLI installer (`tools/installer/`) assembles skills into IDE-specific configurations:

- **`bmad-cli.js`** — Main entry point, uses Commander.js
- **`commands/`** — CLI commands (install.js, uninstall.js, status.js)
- **`prompts.js`** — Interactive installation prompts using @clack/prompts
- **`ide/templates/`** — Templates for various IDEs (Claude Code, Cursor, Kiro, etc.)

During installation:
1. User selects modules and configuration options
2. Skills are compiled from `src/` into IDE-specific formats
3. Configuration is written to `{project}/_bmad/` with `_config/` subdirectories
4. IDE-specific files are generated in project root (e.g., `.claude/skills/`)

### Documentation Site

- **`docs/`** — Markdown content organized by type (tutorials/, how-to/, explanation/, reference/)
- **`website/`** — Astro + Starlight configuration
- **`website/src/content/docs`** → Symlink to `../../docs`

The build pipeline produces static HTML in `build/site/` plus LLM-friendly `llms.txt` files.

### Validation Tools

- **`tools/validate-file-refs.js`** — Validates file references in YAML, MD, CSV files
- **`tools/validate-skills.js`** — Validates skill definitions against schema
- **`tools/fix-doc-links.js`** — Fixes broken documentation links

## Development Patterns

### Code Style

- **JavaScript**: Node.js 20+, mix of CommonJS (tools/) and ESM (config files)
- **Function ordering**: Define callers above callees (top-to-bottom call order)
- **File extensions**: Use `.yaml` consistently (enforced by ESLint)
- **Quotes in YAML**: Prefer double quotes (enforced by ESLint)

### Skill Conventions

- Skill names use kebab-case: `bmad-create-prd`, `bmad-agent-dev`
- Skills should be lean for dev agents; web/planning agents can be larger
- Everything is natural language (markdown) — no code in core framework skills
- Use BMad modules for domain-specific features

### Testing

- Test files in `test/` use `.js` or `.mjs` extensions
- Fixtures in `test/fixtures/`
- Tests intentionally relaxed on some ESLint rules (no-unused-vars, etc.)

## Contributing

- **Target branch**: `main` (trunk-based development)
- **PR size**: Ideal 200-400 lines, maximum 800 lines (excluding generated files)
- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
- **AI-generated code**: Requires heavy human curation — understand every line submitted

### Pre-commit Checks

```bash
npm run quality    # Runs format, lint, docs build, tests, validations
```

## Key File Locations

| Purpose | Path |
|---------|------|
| Skill source | `src/core-skills/`, `src/bmm-skills/` |
| CLI installer | `tools/installer/` |
| Validation tools | `tools/validate-*.js` |
| Tests | `test/` |
| Documentation | `docs/` |
| Website config | `website/astro.config.mjs` |
| ESLint config | `eslint.config.mjs` |
| Package config | `package.json` |
