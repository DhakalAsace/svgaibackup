# Git Worktree Setup for Parallel Development

## Overview
This document outlines the git worktree setup for parallel development of the SVG AI SEO Empire project. The worktrees enable multiple Claude Code sessions to work on different features simultaneously without context conflicts.

## Created Worktrees

### 1. Converters Worktree
- **Path**: `/mnt/a/svgai-converters`
- **Branch**: `feature/converters`
- **Purpose**: Development of 40 converter tools (150,000+ searches/month)
- **Primary Tasks**: Task 3 (conversion engine) + Task 4 (converter UI)
- **Example Focus Areas**:
  - PNG to SVG converter (40,500 searches)
  - SVG to PNG converter (40,500 searches)
  - JPG to SVG converter (27,100 searches)
  - Client-side conversion implementations

### 2. Galleries Worktree
- **Path**: `/mnt/a/svgai-galleries`
- **Branch**: `feature/galleries`
- **Purpose**: Development of 19 gallery themes (37,700+ searches/month)
- **Primary Task**: Task 7 (gallery system)
- **Example Focus Areas**:
  - Heart SVG gallery (14,800 searches)
  - Hello Kitty SVG gallery (2,400 searches)
  - Butterfly SVG gallery (4,400 searches)
  - Gallery browsing and filtering UI

### 3. Learn Pages Worktree
- **Path**: `/mnt/a/svgai-learn`
- **Branch**: `feature/learn-pages`
- **Purpose**: Development of 12 educational pages (60,000+ searches/month)
- **Primary Task**: Task 8 (learn pages)
- **Example Focus Areas**:
  - What is SVG (33,100 searches)
  - SVG file format (14,800 searches)
  - How to convert to SVG (9,900 searches)
  - Comprehensive educational content

## Usage Instructions

### Starting Parallel Sessions

Each worktree can run its own Claude Code session:

```bash
# Terminal 1: Main orchestration
cd /mnt/a/svgaibackup && claude

# Terminal 2: Converter development
cd /mnt/a/svgai-converters && claude

# Terminal 3: Gallery development
cd /mnt/a/svgai-galleries && claude

# Terminal 4: Learn pages development
cd /mnt/a/svgai-learn && claude
```

### Important Rules for Each Session

**EVERY session must start with:**
```bash
cat rules.txt  # or cat ../svgaibackup/rules.txt from worktrees
```

### Worktree Commands

```bash
# List all worktrees
git worktree list

# Remove a worktree (if needed)
git worktree remove /path/to/worktree

# Add a new worktree
git worktree add -b branch-name /path/to/new-worktree
```

### Syncing Changes

```bash
# From main repository
git fetch origin
git merge feature/converters --no-ff
git merge feature/galleries --no-ff
git merge feature/learn-pages --no-ff

# Push all branches
git push origin feature/converters
git push origin feature/galleries
git push origin feature/learn-pages
```

## Development Strategy

### Phase 1: Foundation (0-20% context)
- Main repo: Task 1 (setup) + Task 10 orchestration
- Learn worktree: Create initial 5-10 educational pages
- All worktrees: Create placeholder pages with full SEO

### Phase 2: Parallel Execution (20-60% context)
- Converters worktree: Build conversion engine + UI
- Galleries worktree: Implement gallery system
- Learn worktree: Complete all educational content
- Main repo: Coordinate integration

### Phase 3: Integration (60-90% context)
- Main repo: Merge all features
- All worktrees: Polish and optimize
- Main repo: Task 5 (premium tools) + Task 6 (animation tool)

## Best Practices

1. **Context Management**: Clear context at 50% and 75% usage
2. **Daily Syncs**: Merge completed work daily to avoid conflicts
3. **Feature Boundaries**: Keep changes isolated to assigned features
4. **Documentation**: Update this file with any process improvements
5. **Rules Compliance**: Every session must read rules.txt first

## Quick Reference

| Worktree | Path | Branch | Focus |
|----------|------|--------|-------|
| Main | `/mnt/a/svgaibackup` | `main` | Orchestration |
| Converters | `/mnt/a/svgai-converters` | `feature/converters` | 40 converter tools |
| Galleries | `/mnt/a/svgai-galleries` | `feature/galleries` | 19 gallery themes |
| Learn | `/mnt/a/svgai-learn` | `feature/learn-pages` | 12 educational pages |

## Setup Commands Used

```bash
# Created worktrees with:
git worktree add -b feature/converters /mnt/a/svgai-converters
git worktree add -b feature/galleries /mnt/a/svgai-galleries
git worktree add -b feature/learn-pages /mnt/a/svgai-learn
```

---

*Last Updated: December 2024*
*Setup completed for SVG AI SEO Empire parallel development strategy*