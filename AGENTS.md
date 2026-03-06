# agents.md - Comprehensive Template

> **How to use this template:**
>
> 1. Copy this file to your project root
> 2. Replace placeholders `[Reference: README.md → ...]` with actual links/sections
> 3. Customize examples to match your tech stack
> 4. Remove sections that don't apply to your project
> 5. Add project-specific guidelines as needed

---

## File Directory Structure

**Reference:** See `README.md` → File Directory Structure section for detailed directory layout

---

## Technologies

**Reference:** See `README.md` → Technologies section for detailed technology stack

---

## Coding Conventions & Style

### Naming Conventions

- **Reference:** See `README.md` → Naming Standards

### Code Organization

- **Line length limit:** 120 Characters

### Commenting & Documentation

- **Comment WHY, not WHAT:** Code shows what; comments explain why
- **Document public APIs:** Every exported function/class needs JSDoc/docstring
- **Avoid obvious comments:** Don't comment `i++` in a loop
- **Use TODO/FIXME sparingly:** Link to issue tracking system when used

### Avoid Anti-Patterns

- ❌ **God Objects:** Classes doing too many things
- ❌ **Deep Nesting:** More than 3 levels of nesting = refactor
- ❌ **Circular Dependencies:** Component A depends on B, B depends on A
- ❌ **Tight Coupling:** Hard-coded dependencies instead of injected
- ❌ **Magic Values:** Use constants instead of hard-coded strings/numbers

---

### Testing

- All function should have unit-test

---

## Git Workflow & Branching

### Branch Naming Convention

- **Feature:** `feature/short-description`
  - Example: `feature/add-payment-method`
  
- **Bug fix:** `bugfix/short-description`
  - Example: `bugfix/fix-login-redirect`
  
- **Hotfix:** `hotfix/short-description`
  - Example: `hotfix/payment-processor-crash`
  
- **Release:** `release/v1.0.0`
  - Example: `release/v1.2.3`

---

## Summary Checklist

Use this checklist when setting up a new project:

- [ ] **Coding Conventions:** Define naming, organization, commenting standards
- [ ] **Design Patterns:** Identify which patterns apply to your project
- [ ] **Environment Configuration:** Set up `.env`, config files, secret management
- [ ] **Testing:** Choose frameworks, set up structure, define coverage targets
- [ ] **Logging:** Choose tool, define log levels, organize logs
- [ ] **Error Handling:** Define error types, standardize responses
- [ ] **Performance:** Set targets, define optimization rules
- [ ] **Security:** Set up auth, secrets management, encryption
- [ ] **Git Workflow:** Define branching, commits, PR process
- [ ] **Dependencies:** Choose package manager, audit strategy
