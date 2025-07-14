# Multi-Agent Quick Reference Card

## 🎯 Mission
Build SVG AI SEO Empire: 250,000+ monthly searches → 150,000 organic sessions

## 🤖 Agent Setup

### Main Agent Commands
```bash
# Start every session
cat rules.txt
task-master list | grep in-progress

# Create worktrees for parallel work
git worktree add ../svgai-converters feature/converters
git worktree add ../svgai-content feature/content
git worktree add ../svgai-galleries feature/galleries
```

### Sub-Agent Template
```
"FIRST: Read /mnt/a/svgaibackup/rules.txt and follow all rules.

[Your specific task here]

Success Metric: [How to verify completion]
Return: [Exact deliverable format]"
```

## 📊 Context Checkpoints

| Context % | Action |
|-----------|--------|
| 0% | Read rules.txt, start Task 1 & 8 |
| 10% | Spawn content sub-agents |
| 20% | Start converter placeholders |
| 25% | Deploy & checkpoint |
| 50% | Clear context, reload task |
| 75% | Final push, prepare launch |

## 🚀 Parallel Execution Map

```
Main Agent (Hub)
├── Sub-Agent 1: MDX Content Writer
├── Sub-Agent 2: Technical Researcher  
├── Sub-Agent 3: SEO Analyzer
│
├── Worktree 1: Converters (Task 3,4)
├── Worktree 2: Content (Task 8,2)
└── Worktree 3: Features (Task 6,7)
```

## 📝 Priority Tasks by Search Volume

1. **Learn Pages** (60k+ searches) - Task 8
   - /learn/what-is-svg (33,100)
   - /learn/svg-file (14,800)
   - /learn/svg-file-format (9,900)

2. **Top Converters** (127k+ searches) - Task 2
   - /convert/png-to-svg (40,500)
   - /convert/svg-to-png (33,100)
   - /convert/svg-converter (33,100)
   - /convert/jpg-to-svg (12,100)
   - /convert/image-to-svg (8,100)

3. **Galleries** (37k+ searches) - Task 7
   - /gallery/heart-svg (9,900)
   - /gallery/hello-kitty-svg (4,400)

## ⚡ Quick Commands

```bash
# Check progress
task-master list | grep done | wc -l

# Update task
task-master set-status --id=X.X --status=done

# Deploy preview
vercel --prod

# Merge work
git merge feature/converters --no-ff

# Track metrics
echo "Pages: $(find content -name "*.mdx" | wc -l)" >> METRICS.md
```

## 🛑 Remember
- DON'T touch /content/blog/ (already ranking)
- DO read rules.txt every session
- DO use placeholder strategy
- DO spawn sub-agents for parallel work
- FREE: All converters, editor, optimizer, animations
- PAID: AI generation, video export only