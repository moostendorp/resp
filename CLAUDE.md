# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a TypeScript/Node.js project configured for pure ESM (ECMAScript Modules) with direct TypeScript execution via Node.js.

## ⚠️ IMPORTANT: Git Commit Policy

**NEVER commit changes to git without explicit user permission.** Always ask the user before making any git commits, even for fixes or improvements. The user must approve all commits.


## Tooling for shell interactions
Is it about finding FILES? use 'fd'
Is it about finding TEXT/strings? use 'rg'
Is it about finding CODE STRUCTURE? use 'ast-grep'
Is it about SELECTING from multiple results? pipe to 'fzf'
Is it about interacting with JSON? use 'jq'
Is it about interacting with YAML or XML? use 'yq'


### Key Configuration
- **Pure ESM**: `"type": "module"` in package.json enables ES module syntax
- **Direct TypeScript Execution**: No build step - TypeScript files run directly with Node.js
- **NodeNext Module Resolution**: tsconfig.json uses "module": "NodeNext" and "moduleResolution": "NodeNext"
- **Package Manager**: pnpm (specified in packageManager field)

### Import Patterns
- Use `.ts` file extensions in imports (required for NodeNext resolution)
- ES module syntax only (`import`/`export`, not `require`)

## Development Commands

```bash
# Install dependencies
pnpm install

# Run application
pnpm start

# Development with watch mode
pnpm dev

# Run tests
pnpm test
```

## Testing

Uses Vitest as the test runner. Test files should use `.test.ts` suffix and be co-located with source files in the `src/` directory.

Test imports:
```typescript
import { describe, it, expect } from 'vitest';
```

## File Structure

```
src/
├── index.ts       # Main entry point
└── *.test.ts      # Test files (co-located)
```
