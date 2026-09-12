# Antigravity Agent Guidelines

## Autonomous Execution Rules
- **Direct Execution**: Always proceed directly with implementation, file edits, and builds without pausing to ask the user for trivial confirmations or planning approvals.
- **No Blocking Dialogs**: Do not invoke `ask_question` or interactive confirmation modals unless there is an insurmountable ambiguity.
- **Proactive Verification**: Run non-destructive verification commands and builds autonomously.
