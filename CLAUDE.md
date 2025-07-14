# Task Master AI - Claude Code Integration Guide

## 🎯 SVG AI SEO Empire Mission

### Project Overview
Building a comprehensive SEO empire targeting 250,000+ monthly searches across:
- **40 Converter Tools**: 150,000+ searches (png to svg, svg to png, etc.)
- **19 Gallery Themes**: 37,700+ searches (heart svg, hello kitty svg, etc.)
- **12 Learn Pages**: 60,000+ searches (svg file format, how to convert, etc.)
- **Animation Tools**: 7,720+ searches (svg animation, animated svg)

### North Star Goals
- 150,000 organic sessions/month within 6 months
- 5,000 paid events/month (AI generation, video export)
- Convert free tool users → paid AI generation customers

### Monetization Strategy
**FREE Tools** (Drive Traffic):
- All 40 converters (client-side, no server cost)
- SVG Editor (CodeMirror-based)
- SVG Optimizer (svgo library)
- CSS Animation Tool

**PAID Tools** (Generate Revenue):
- AI SVG Generation (existing)
- SVG to Video/GIF Export (2-5 credits per use)

## Essential Commands

### Core Workflow Commands

```bash
# Project Setup
task-master init                                    # Initialize Task Master in current project
task-master parse-prd .taskmaster/docs/prd.txt      # Generate tasks from PRD document
task-master models --setup                        # Configure AI models interactively

# Daily Development Workflow
task-master list                                   # Show all tasks with status
task-master next                                   # Get next available task to work on
task-master show <id>                             # View detailed task information (e.g., task-master show 1.2)
task-master set-status --id=<id> --status=done    # Mark task complete

# Task Management
task-master add-task --prompt="description" --research        # Add new task with AI assistance
task-master expand --id=<id> --research --force              # Break task into subtasks
task-master update-task --id=<id> --prompt="changes"         # Update specific task
task-master update --from=<id> --prompt="changes"            # Update multiple tasks from ID onwards
task-master update-subtask --id=<id> --prompt="notes"        # Add implementation notes to subtask

# Analysis & Planning
task-master analyze-complexity --research          # Analyze task complexity
task-master complexity-report                      # View complexity analysis
task-master expand --all --research               # Expand all eligible tasks

# Dependencies & Organization
task-master add-dependency --id=<id> --depends-on=<id>       # Add task dependency
task-master move --from=<id> --to=<id>                       # Reorganize task hierarchy
task-master validate-dependencies                            # Check for dependency issues
task-master generate                                         # Update task markdown files (usually auto-called)
```

## Key Files & Project Structure

### Core Files

- `.taskmaster/tasks/tasks.json` - Main task data file (auto-managed)
- `.taskmaster/config.json` - AI model configuration (use `task-master models` to modify)
- `.taskmaster/docs/prd.txt` - Product Requirements Document for parsing
- `.taskmaster/tasks/*.txt` - Individual task files (auto-generated from tasks.json)
- `.env` - API keys for CLI usage

### Claude Code Integration Files

- `CLAUDE.md` - Auto-loaded context for Claude Code (this file)
- `.claude/settings.json` - Claude Code tool allowlist and preferences
- `.claude/commands/` - Custom slash commands for repeated workflows
- `.mcp.json` - MCP server configuration (project-specific)

### Directory Structure

```
project/
├── .taskmaster/
│   ├── tasks/              # Task files directory
│   │   ├── tasks.json      # Main task database
│   │   ├── task-1.md      # Individual task files
│   │   └── task-2.md
│   ├── docs/              # Documentation directory
│   │   ├── prd.txt        # Product requirements
│   ├── reports/           # Analysis reports directory
│   │   └── task-complexity-report.json
│   ├── templates/         # Template files
│   │   └── example_prd.txt  # Example PRD template
│   └── config.json        # AI models & settings
├── .claude/
│   ├── settings.json      # Claude Code configuration
│   └── commands/         # Custom slash commands
├── .env                  # API keys
├── .mcp.json            # MCP configuration
└── CLAUDE.md            # This file - auto-loaded by Claude Code
```

## MCP Integration

Task Master provides an MCP server that Claude Code can connect to. Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your_key_here",
        "PERPLEXITY_API_KEY": "your_key_here",
        "OPENAI_API_KEY": "OPENAI_API_KEY_HERE",
        "GOOGLE_API_KEY": "GOOGLE_API_KEY_HERE",
        "XAI_API_KEY": "XAI_API_KEY_HERE",
        "OPENROUTER_API_KEY": "OPENROUTER_API_KEY_HERE",
        "MISTRAL_API_KEY": "MISTRAL_API_KEY_HERE",
        "AZURE_OPENAI_API_KEY": "AZURE_OPENAI_API_KEY_HERE",
        "OLLAMA_API_KEY": "OLLAMA_API_KEY_HERE"
      }
    }
  }
}
```

### Essential MCP Tools

```javascript
help; // = shows available taskmaster commands
// Project setup
initialize_project; // = task-master init
parse_prd; // = task-master parse-prd

// Daily workflow
get_tasks; // = task-master list
next_task; // = task-master next
get_task; // = task-master show <id>
set_task_status; // = task-master set-status

// Task management
add_task; // = task-master add-task
expand_task; // = task-master expand
update_task; // = task-master update-task
update_subtask; // = task-master update-subtask
update; // = task-master update

// Analysis
analyze_project_complexity; // = task-master analyze-complexity
complexity_report; // = task-master complexity-report
```

## Claude Code Workflow Integration

### Standard Development Workflow

#### 1. Project Initialization

```bash
# Initialize Task Master
task-master init

# Create or obtain PRD, then parse it
task-master parse-prd .taskmaster/docs/prd.txt

# Analyze complexity and expand tasks
task-master analyze-complexity --research
task-master expand --all --research
```

If tasks already exist, another PRD can be parsed (with new information only!) using parse-prd with --append flag. This will add the generated tasks to the existing list of tasks..

#### 2. Daily Development Loop

```bash
# Start each session
task-master next                           # Find next available task
task-master show <id>                     # Review task details

# During implementation, check in code context into the tasks and subtasks
task-master update-subtask --id=<id> --prompt="implementation notes..."

# Complete tasks
task-master set-status --id=<id> --status=done
```

#### 3. Multi-Claude Workflows

For complex projects, use multiple Claude Code sessions:

```bash
# Terminal 1: Main implementation
cd project && claude

# Terminal 2: Testing and validation
cd project-test-worktree && claude

# Terminal 3: Documentation updates
cd project-docs-worktree && claude
```

### Custom Slash Commands

Create `.claude/commands/taskmaster-next.md`:

```markdown
Find the next available Task Master task and show its details.

Steps:

1. Run `task-master next` to get the next task
2. If a task is available, run `task-master show <id>` for full details
3. Provide a summary of what needs to be implemented
4. Suggest the first implementation step
```

Create `.claude/commands/taskmaster-complete.md`:

```markdown
Complete a Task Master task: $ARGUMENTS

Steps:

1. Review the current task with `task-master show $ARGUMENTS`
2. Verify all implementation is complete
3. Run any tests related to this task
4. Mark as complete: `task-master set-status --id=$ARGUMENTS --status=done`
5. Show the next available task with `task-master next`
```

## Tool Allowlist Recommendations

Add to `.claude/settings.json`:

```json
{
  "allowedTools": [
    "Edit",
    "Bash(task-master *)",
    "Bash(git commit:*)",
    "Bash(git add:*)",
    "Bash(npm run *)",
    "mcp__task_master_ai__*"
  ]
}
```

## Configuration & Setup

### API Keys Required

At least **one** of these API keys must be configured:

- `ANTHROPIC_API_KEY` (Claude models) - **Recommended**
- `PERPLEXITY_API_KEY` (Research features) - **Highly recommended**
- `OPENAI_API_KEY` (GPT models)
- `GOOGLE_API_KEY` (Gemini models)
- `MISTRAL_API_KEY` (Mistral models)
- `OPENROUTER_API_KEY` (Multiple models)
- `XAI_API_KEY` (Grok models)

An API key is required for any provider used across any of the 3 roles defined in the `models` command.

### Model Configuration

```bash
# Interactive setup (recommended)
task-master models --setup

# Set specific models
task-master models --set-main claude-3-5-sonnet-20241022
task-master models --set-research perplexity-llama-3.1-sonar-large-128k-online
task-master models --set-fallback gpt-4o-mini
```

## Task Structure & IDs

### Task ID Format

- Main tasks: `1`, `2`, `3`, etc.
- Subtasks: `1.1`, `1.2`, `2.1`, etc.
- Sub-subtasks: `1.1.1`, `1.1.2`, etc.

### Task Status Values

- `pending` - Ready to work on
- `in-progress` - Currently being worked on
- `done` - Completed and verified
- `deferred` - Postponed
- `cancelled` - No longer needed
- `blocked` - Waiting on external factors

### Task Fields

```json
{
  "id": "1.2",
  "title": "Implement user authentication",
  "description": "Set up JWT-based auth system",
  "status": "pending",
  "priority": "high",
  "dependencies": ["1.1"],
  "details": "Use bcrypt for hashing, JWT for tokens...",
  "testStrategy": "Unit tests for auth functions, integration tests for login flow",
  "subtasks": []
}
```

## Claude Code Best Practices with Task Master

### Context Management

- Use `/clear` between different tasks to maintain focus
- This CLAUDE.md file is automatically loaded for context
- Use `task-master show <id>` to pull specific task context when needed

### Iterative Implementation

1. `task-master show <subtask-id>` - Understand requirements
2. Explore codebase and plan implementation
3. `task-master update-subtask --id=<id> --prompt="detailed plan"` - Log plan
4. `task-master set-status --id=<id> --status=in-progress` - Start work
5. Implement code following logged plan
6. `task-master update-subtask --id=<id> --prompt="what worked/didn't work"` - Log progress
7. `task-master set-status --id=<id> --status=done` - Complete task

### Complex Workflows with Checklists

For large migrations or multi-step processes:

1. Create a markdown PRD file describing the new changes: `touch task-migration-checklist.md` (prds can be .txt or .md)
2. Use Taskmaster to parse the new prd with `task-master parse-prd --append` (also available in MCP)
3. Use Taskmaster to expand the newly generated tasks into subtasks. Consdier using `analyze-complexity` with the correct --to and --from IDs (the new ids) to identify the ideal subtask amounts for each task. Then expand them.
4. Work through items systematically, checking them off as completed
5. Use `task-master update-subtask` to log progress on each task/subtask and/or updating/researching them before/during implementation if getting stuck

### Git Integration

Task Master works well with `gh` CLI:

```bash
# Create PR for completed task
gh pr create --title "Complete task 1.2: User authentication" --body "Implements JWT auth system as specified in task 1.2"

# Reference task in commits
git commit -m "feat: implement JWT auth (task 1.2)"
```

### Parallel Development with Git Worktrees

```bash
# Create worktrees for parallel task development
git worktree add ../project-auth feature/auth-system
git worktree add ../project-api feature/api-refactor

# Run Claude Code in each worktree
cd ../project-auth && claude    # Terminal 1: Auth work
cd ../project-api && claude     # Terminal 2: API work
```

## Troubleshooting

### AI Commands Failing

```bash
# Check API keys are configured
cat .env                           # For CLI usage

# Verify model configuration
task-master models

# Test with different model
task-master models --set-fallback gpt-4o-mini
```

### MCP Connection Issues

- Check `.mcp.json` configuration
- Verify Node.js installation
- Use `--mcp-debug` flag when starting Claude Code
- Use CLI as fallback if MCP unavailable

### Task File Sync Issues

```bash
# Regenerate task files from tasks.json
task-master generate

# Fix dependency issues
task-master fix-dependencies
```

DO NOT RE-INITIALIZE. That will not do anything beyond re-adding the same Taskmaster core files.

## Important Notes

### AI-Powered Operations

These commands make AI calls and may take up to a minute:

- `parse_prd` / `task-master parse-prd`
- `analyze_project_complexity` / `task-master analyze-complexity`
- `expand_task` / `task-master expand`
- `expand_all` / `task-master expand --all`
- `add_task` / `task-master add-task`
- `update` / `task-master update`
- `update_task` / `task-master update-task`
- `update_subtask` / `task-master update-subtask`

### File Management

- Never manually edit `tasks.json` - use commands instead
- Never manually edit `.taskmaster/config.json` - use `task-master models`
- Task markdown files in `tasks/` are auto-generated
- Run `task-master generate` after manual changes to tasks.json

### Claude Code Session Management

- Use `/clear` frequently to maintain focused context
- Create custom slash commands for repeated Task Master workflows
- Configure tool allowlist to streamline permissions
- Use headless mode for automation: `claude -p "task-master next"`

### Multi-Task Updates

- Use `update --from=<id>` to update multiple future tasks
- Use `update-task --id=<id>` for single task updates
- Use `update-subtask --id=<id>` for implementation logging

### Research Mode

- Add `--research` flag for research-based AI enhancement
- Requires a research model API key like Perplexity (`PERPLEXITY_API_KEY`) in environment
- Provides more informed task creation and updates
- Recommended for complex technical tasks

---

## 🚀 Multi-Agent SEO Empire Strategy

### Overview
Leverage multiple Claude Code agents and sub-agents to build the SEO empire 4x faster through parallel execution.

### Agent Architecture

#### Main Agent (Hub) - You
- **Role**: Project orchestrator, task manager, quality control
- **Focus**: Maintains project context, spawns sub-agents, reviews work
- **Key Tasks**: Task 1 (setup), Task 10 (launch), all task-master operations

#### Sub-Agents (Task Tool)
- **Usage**: Spawn for specific research, content creation, or implementation
- **Advantage**: Don't consume main context, return focused results
- **Best For**: MDX content writing, technical research, performance analysis

#### Parallel Sessions (Git Worktrees)
- **Setup**: Create worktrees for independent feature development
- **Usage**: Run separate Claude sessions in each worktree
- **Best For**: Complex features like conversion engine, galleries, animation tool

### Implementation Phases (Context-Based Progression)

#### Phase 1: Foundation Sprint (0-20% context usage)
```bash
# Initial Setup
cat rules.txt  # ALWAYS read rules first
task-master set-status --id=1 --status=in-progress  # Setup
task-master set-status --id=8 --status=in-progress  # Learn pages

# Spawn sub-agent for content batch
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.
Write comprehensive MDX content for these 5 learn pages:
1. /learn/what-is-svg (33,100 searches)
2. /learn/svg-file (14,800 searches)
3. /learn/svg-file-format (9,900 searches)
Include 2000+ words, schema markup, internal links to future converters"

# After 10 pages created or 15% context
task-master set-status --id=2 --status=in-progress

# Create all 40 converter pages with "coming soon" + full SEO content
# This gets pages indexed while building functionality
```

#### Phase 2: Parallel Execution (20-60% context usage)
```bash
# Parallel Development Setup
git worktree add ../svgai-converters feature/converters
git worktree add ../svgai-galleries feature/galleries

# Session 1: Main agent (orchestration)
cd /mnt/a/svgaibackup && claude
cat rules.txt  # Read rules every new session

# Session 2: Converter development
cd ../svgai-converters && claude
cat ../svgaibackup/rules.txt  # Each session reads rules
# Focus: Task 3 (conversion engine) + Task 4 (UI)

# Session 3: Gallery development  
cd ../svgai-galleries && claude
cat ../svgaibackup/rules.txt
# Focus: Task 7 (gallery system)
```

#### Phase 3: Integration & Polish (60-90% context usage)
- Task 5: Premium tools (SVG to Video)
- Task 6: Free animation tool (funnel to premium)
- Task 9: Performance optimization
- Task 10: Launch preparations

### Sub-Agent Best Practices

#### Content Creation Sub-Agent
```
"CRITICAL: First read /mnt/a/svgaibackup/rules.txt and adhere to all rules.

Research and write MDX content for 'png to svg converter':
- Target keyword: 'png to svg' (40,500 searches/month)
- 2000+ words with step-by-step guide
- Include HowTo schema markup
- Reference existing blog structure in /content/blog/
- Add internal links to related converters
Return complete MDX file ready for deployment"
```

#### Technical Research Sub-Agent
```
"CRITICAL: First read /mnt/a/svgaibackup/rules.txt and adhere to all rules.

Investigate implementation of these 5 converters using client-side libraries:
1. PNG to SVG (use potrace)
2. SVG to PNG (use Canvas API)
3. JPG to SVG (use potrace)
4. SVG to PDF (research best library)
5. WebP to SVG (use sharp)
Return working code examples and library recommendations"
```

#### SEO Analysis Sub-Agent
```
"CRITICAL: First read /mnt/a/svgaibackup/rules.txt and adhere to all rules.

Analyze top 3 competitors for 'svg converter' keyword:
- Content length and structure
- Technical features offered
- Conversion CTAs used
- Page load performance
Return gaps we can exploit and unique angles"
```

### Progress Checkpoints (Context-Based)

#### Every 10% Context Usage
```bash
# Read rules to stay aligned
cat rules.txt

# Check current progress
task-master list | grep in-progress

# Review sub-agent outputs
ls -la SUBAGENT_REPORTS/

# Merge any completed work
git status
git merge feature/converters --no-ff
git merge feature/galleries --no-ff
```

#### Every 25% Context Usage (Major Checkpoint)
```bash
# Full progress review
task-master list
echo "Context at 25%: $(task-master list | grep completed | wc -l) tasks done" >> PROGRESS.md

# Deploy current state
vercel --prod

# Clear context if needed and reload current task
/clear
task-master show [current-task-id]
cat rules.txt
```

### Context Management

#### Main Agent Context Preservation
- Clear context between major task switches: `/clear`
- Reload current task: `task-master show [id]`
- Keep running notes in `IMPLEMENTATION_NOTES.md`

#### Sub-Agent Instructions Template
```
MANDATORY: Read /mnt/a/svgaibackup/rules.txt before proceeding

Context: Building SVG AI SEO Empire targeting 250k+ monthly searches
Current Task: [Specific task from taskmaster]
Objective: [Clear, measurable outcome]
Constraints: [Follow rules.txt, quality standards, specific requirements]
Expected Output: [Exact format needed]
Reference: [Existing code/content to follow]
Success Metric: [How to verify completion]
```

### Performance Tracking

```bash
# Progress by context usage
echo "Context: $(claude context-usage)%" >> PROGRESS.md
echo "Tasks completed: $(task-master list | grep done | wc -l)" >> PROGRESS.md
echo "Pages created: $(find content -name "*.mdx" | wc -l)" >> PROGRESS.md
echo "Sub-agents spawned: $(ls SUBAGENT_REPORTS/ | wc -l)" >> PROGRESS.md

# Checkpoint metrics
echo "=== Checkpoint at $(claude context-usage)% context ===" >> METRICS.md
echo "Completed tasks: $(task-master list | grep done)" >> METRICS.md
echo "Active worktrees: $(git worktree list | wc -l)" >> METRICS.md
```

### Critical Success Factors

1. **Rules Compliance**: Every agent reads rules.txt first
2. **Content Velocity**: Create 10+ pages before 20% context usage
3. **Parallel Execution**: 3-4 active workstreams via worktrees
4. **Progressive Enhancement**: Deploy placeholder pages → Add features
5. **Context Efficiency**: Clear context at 50%, 75% usage marks

### Risk Mitigation

1. **Merge Conflicts**: Daily syncs, clear feature boundaries
2. **Context Loss**: Document everything in markdown files
3. **Quality Issues**: Main agent reviews before deployment
4. **Dependency Blocks**: Use placeholder strategy
5. **Scope Creep**: Strict adherence to task definitions

---

_This guide ensures Claude Code has immediate access to Task Master's essential functionality for agentic development workflows, with specific strategies for building the SVG AI SEO Empire using multi-agent patterns._

## 🚀 URGENT: Converter Implementation Multi-Agent Strategy

### Current Status (as of 2025-01-07)
- **17 converters** need implementation (EPS, AI, DXF, STL, HTML, TTF, TIFF, EMF, WMF, HEIC)
- **10 tasks** created (Tasks 11-20) with **52 subtasks**
- **Ready for parallel execution** with 7-9 Claude Code sub-agents

### Quick Start for Main Agent
```bash
# 1. Start infrastructure (Task 11)
task-master set-status --id=11 --status=in-progress
task-master show 11.1

# 2. Implement base converter interface first
# Reference: /lib/converters/png-to-svg.ts
# Create: /lib/converters/base-converter.ts

# 3. After each subtask completion:
task-master set-status --id=11.1 --status=done
task-master update-subtask --id=11.1 --prompt="Completed base interface with ConversionHandler type..."
task-master show 11.2  # Move to next subtask

# 4. After infrastructure, spawn 7 sub-agents for parallel work
```

### ⚠️ CRITICAL: Use Taskmaster Throughout Implementation
**EVERY Claude session (main and sub-agents) MUST:**
1. Start by checking current task: `task-master show [task-id]`
2. Mark subtasks in-progress: `task-master set-status --id=[subtask-id] --status=in-progress`
3. Update progress regularly: `task-master update-subtask --id=[subtask-id] --prompt="progress notes"`
4. Mark complete when done: `task-master set-status --id=[subtask-id] --status=done`
5. Check next subtask: `task-master show [next-subtask-id]`

**Example workflow for any subtask:**
```bash
# Start work
task-master show 12.1
task-master set-status --id=12.1 --status=in-progress

# During implementation
task-master update-subtask --id=12.1 --prompt="Integrated PDF.js, testing with sample EPS files..."

# Complete and move on
task-master set-status --id=12.1 --status=done
task-master show 12.2
```

### Sub-Agent Deployment Instructions

#### Sub-Agent 1: PostScript Converters (Task 12)
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Implement PostScript converters (Task 12 - 7 subtasks):
- Read: /lib/converters/png-to-svg.ts (reference pattern)
- Read: /lib/converters/types.ts
- Use existing pdfjs-dist for PDF-compatible EPS/AI
- Create: eps-to-svg.ts, ai-to-svg.ts, svg-to-eps.ts
- Create UI components in /components/converters/

IMPORTANT: Use taskmaster throughout:
- Start: task-master show 12.1
- Progress: task-master set-status --id=12.1 --status=in-progress
- Update: task-master update-subtask --id=12.1 --prompt='progress notes'
- Complete: task-master set-status --id=12.1 --status=done
- Continue with 12.2, 12.3, etc.

Return complete working implementation with taskmaster progress updates."
```

#### Sub-Agent 2: CAD Converters (Task 13)
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Implement CAD converters (Task 13 - 5 subtasks):
- Install: dxf-parser, dxf-writer
- Handle DXF entities: LINE, CIRCLE, ARC, POLYLINE
- Support layers and coordinate transformation

Use taskmaster: Start with 'task-master show 13.1', mark in-progress, update progress, mark done.
Work through subtasks 13.1 to 13.5 systematically.
Return complete DXF ↔ SVG implementation."
```

#### Sub-Agent 3: 3D Converters (Task 14)
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Implement 3D converters (Task 14 - 6 subtasks):
- Parse STL ASCII/binary formats
- Implement 3D projection (orthographic/perspective)
- Create SVG path extrusion algorithm
No external libs needed - implement from scratch.

Use taskmaster for all 6 subtasks (14.1-14.6).
Document progress with update-subtask commands."
```

#### Sub-Agent 4: Web/Font Converters (Task 15)
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Implement web/font converters (Task 15 - 4 subtasks):
- Install: html2canvas, opentype.js
- HTML to canvas to SVG conversion
- TTF glyph extraction as SVG paths

Track progress through taskmaster (15.1-15.4).
Return complete implementation with status updates."
```

#### Sub-Agent 5: Raster Converters (Task 16)
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Implement TIFF converters (Task 16 - 4 subtasks):
- Install: utif
- Use existing potrace for vectorization
- Handle multi-page TIFF, various compressions

Use taskmaster for subtasks 16.1-16.4.
Return complete TIFF ↔ SVG implementation."
```

#### Sub-Agent 6: Legacy Windows (Task 17)
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Implement Windows metafile converters (Task 17 - 7 subtasks):
- Parse EMF/WMF binary format
- Map GDI commands to SVG
- Handle coordinate systems and objects
Focus on basic shapes first. Complex task!

CRITICAL: Use taskmaster for all 7 subtasks (17.1-17.7).
Update progress frequently due to complexity."
```

#### Sub-Agent 7: Modern Formats (Task 18)
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

Implement HEIC converters (Task 18 - 3 subtasks):
- Install: heic2any
- Handle browser compatibility
- Implement fallback strategies

Track with taskmaster (18.1-18.3).
Return complete HEIC ↔ SVG implementation."
```

### Key Implementation Rules
1. **ALL converters are FREE** - Client-side only, no server processing
2. **Use lazy loading** - Dynamic imports for libraries
3. **Follow existing pattern** - Reference png-to-svg implementation
4. **Update converter-config.ts** - Mark as `isSupported: true` when done
5. **Create page routes** - Each converter needs a page in /app/convert/

### Progress Tracking & Taskmaster Discipline
```bash
# Check overall progress
task-master list | grep -E "(11|12|13|14|15|16|17|18|19|20)"

# MANDATORY workflow for EVERY subtask:
# 1. Start
task-master show 11.1
task-master set-status --id=11.1 --status=in-progress

# 2. During implementation (multiple times)
task-master update-subtask --id=11.1 --prompt="Created base interface with ConversionHandler..."
task-master update-subtask --id=11.1 --prompt="Added error handling classes..."
task-master update-subtask --id=11.1 --prompt="Implemented lazy loading system..."

# 3. Complete
task-master set-status --id=11.1 --status=done

# 4. Move to next
task-master show 11.2
```

### 📊 Daily Progress Report Template
```bash
# At end of each work session, run:
echo "=== Progress Report $(date) ===" >> CONVERTER_PROGRESS.md
task-master list | grep -E "(11|12|13|14|15|16|17|18|19|20)" >> CONVERTER_PROGRESS.md
echo "Completed today:" >> CONVERTER_PROGRESS.md
task-master list | grep done | grep "$(date +%Y-%m-%d)" >> CONVERTER_PROGRESS.md
```

### Files to Update When Adding Converters
1. `/app/convert/converter-config.ts` - Set `isSupported: true`
2. `/lib/converters/[format]-to-svg.ts` - Converter implementation
3. `/components/converters/[format]-to-svg-specific.tsx` - UI component
4. `/app/convert/[url-slug]/page.tsx` - Converter page

### NPM Packages to Install
```json
{
  "dxf-parser": "^1.0.0",
  "dxf-writer": "^1.0.0", 
  "opentype.js": "^1.3.4",
  "utif": "^3.1.0",
  "heic2any": "^0.0.4",
  "html2canvas": "^1.4.1"
}
```

### Success Metrics
- ✅ 17 converters implemented and working
- ✅ All running client-side (zero server costs)
- ✅ <5 second conversion time
- ✅ Clean, maintainable code following existing patterns

---

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

# SEO Empire Implementation Reminders
- DO NOT modify existing blog content in /content/blog/ - it's already ranking
- Create NEW MDX content in separate directories for converters, learn pages, galleries
- Prioritize getting pages indexed quickly - use placeholder strategy
- All converters are FREE (client-side) - only AI generation and video export are PAID
- Target keywords are embedded in each task - no need to check PRD
- Use sub-agents liberally for content creation and research
- Parallel development with git worktrees for 4x speed
- Every task now contains the specific keywords and search volumes needed

# Startup Checklist for Every Session
```bash
# 1. Read the rules
cat rules.txt

# 2. Check current context usage
echo "Starting at X% context usage"

# 3. Review current task status
task-master list | grep in-progress

# 4. For sub-agents, ALWAYS include in prompt:
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules"

# 5. For new worktree sessions:
cat ../svgaibackup/rules.txt
cat ../svgaibackup/CLAUDE.md
```
