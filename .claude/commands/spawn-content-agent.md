Spawn a sub-agent for content creation with proper context.

Steps:
1. Read the sub-agent task queue
2. Identify the next content task to assign
3. Copy the exact prompt template
4. Spawn the sub-agent with Task tool
5. Update tracking when complete

```bash
cat SUB_AGENT_TASKS.md | grep -A 20 "Sub-Agent Task"
```

Remember to:
- Always include "FIRST: Read /mnt/a/svgaibackup/rules.txt" in prompts
- Check context usage before spawning
- Review output before integration
- Update SEO_EMPIRE_TRACKER.md after completion