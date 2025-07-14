Check SEO Empire implementation progress across all agents and worktrees.

Steps:
1. Show current task status from taskmaster
2. Count pages created so far
3. Check active git worktrees
4. Review SEO tracker metrics
5. Identify next priority actions

```bash
# Task progress
task-master list | grep -E "done|in-progress"
echo "Tasks completed: $(task-master list | grep done | wc -l)/10"

# Content progress
echo "MDX pages: $(find content -name "*.mdx" 2>/dev/null | wc -l)"
echo "Converter pages: $(find app/convert -name "page.tsx" 2>/dev/null | wc -l)"
echo "Gallery pages: $(find app/gallery -name "page.tsx" 2>/dev/null | wc -l)"

# Git status
git worktree list
git status --short

# Review tracker
tail -20 SEO_EMPIRE_TRACKER.md
```