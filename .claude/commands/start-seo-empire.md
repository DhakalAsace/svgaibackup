Start the SEO Empire implementation with proper setup and context loading.

Steps:
1. Read the rules file to ensure compliance
2. Load the SEO Empire tracker to see current progress
3. Check taskmaster for next available task
4. Set up for multi-agent execution if at 0% context
5. Provide clear next steps

```bash
cat rules.txt
cat SEO_EMPIRE_TRACKER.md
task-master list | grep -E "pending|in-progress"
task-master next
```

If starting fresh (0% context):
- Start Task 1 (main agent)
- Prepare to spawn sub-agents for content
- Set up git worktrees for parallel development
- Review SUB_AGENT_TASKS.md for ready-to-use prompts