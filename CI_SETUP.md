# CI/CD Setup Documentation

This document outlines the CI/CD configuration for the vec-lovers project.

## Overview

The project is configured with comprehensive CI/CD pipelines that include:
- Linting with ESLint
- Type checking with TypeScript
- Testing with Vitest
- Building with Next.js
- Pre-commit hooks with Husky and lint-staged

## Configuration Files

### Package.json Scripts

#### Development Scripts
- `dev`: Start development server with Turbopack
- `build`: Build production bundle with Turbopack
- `start`: Start production server
- `lint`: Run ESLint with zero warnings allowed
- `lint:fix`: Run ESLint with auto-fix
- `typecheck`: Run TypeScript type checking
- `test`: Run tests with Vitest
- `test:watch`: Run tests in watch mode
- `test:coverage`: Run tests with coverage report

#### CI-Specific Scripts
- `ci:lint`: Run ESLint with JSON output for CI
- `ci:typecheck`: Run TypeScript checking with pretty output
- `ci:test`: Run tests with JSON reporter for CI
- `ci:build`: Build for production
- `ci:validate`: Run all CI checks in sequence

#### Code Quality Scripts
- `format`: Format code with Prettier
- `format:check`: Check code formatting
- `prepare`: Generate Prisma client
- `postinstall`: Install Husky hooks

### ESLint Configuration

The ESLint configuration (`eslint.config.mjs`) includes:
- Standard JavaScript rules
- TypeScript-specific rules
- Next.js core web vitals rules
- Custom rules for better code quality
- Proper ignore patterns for build artifacts

### TypeScript Configuration

Enhanced TypeScript configuration (`tsconfig.json`) with:
- Strict type checking
- Unused variable detection
- Consistent casing enforcement
- Exact optional property types
- No implicit returns
- No fallthrough cases in switch
- Unchecked indexed access protection

### CI Workflow

The GitHub Actions workflow (`.github/workflows/ci.yml`) includes:
- Parallel job execution for faster CI
- Separate jobs for lint, typecheck, test, and build
- Proper dependency management with npm ci
- Build artifact upload
- Node.js 20 with npm caching

### Pre-commit Hooks

Configured with Husky and lint-staged:
- Automatic ESLint fixing on commit
- Prettier formatting for JSON and Markdown files
- Type checking before commit
- Linting before commit

## Usage

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Run linting:
   ```bash
   npm run lint
   ```

4. Run type checking:
   ```bash
   npm run typecheck
   ```

5. Run tests:
   ```bash
   npm test
   ```

### CI/CD

The CI pipeline automatically runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

All checks must pass before merging:
- ESLint (zero warnings)
- TypeScript type checking
- Test suite
- Build process

### Pre-commit

Husky automatically runs:
- ESLint with auto-fix
- TypeScript type checking
- Prettier formatting

## Troubleshooting

### Common Issues

1. **ESLint errors**: Run `npm run lint:fix` to auto-fix issues
2. **TypeScript errors**: Check for type mismatches and unused variables
3. **Test failures**: Ensure all tests pass locally before committing
4. **Build failures**: Check for missing dependencies or configuration issues

### CI Failures

If CI fails:
1. Check the specific job that failed
2. Run the corresponding local command
3. Fix the issues locally
4. Commit and push the fixes

## Best Practices

1. Always run `npm run lint` and `npm run typecheck` before committing
2. Write tests for new features
3. Keep dependencies up to date
4. Use meaningful commit messages
5. Keep the CI pipeline fast by optimizing build times
