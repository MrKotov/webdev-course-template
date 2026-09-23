# Web Development course · your workspace

This repository is your workspace for the whole course: Exercise 1 in `mcp-server/`, and your project (Exercises 2–5) in the rest of it. Everything runs in your browser through GitHub Codespaces, so nothing needs to be installed on your laptop.

## Start

1. On the course template page, click **Use this template → Create a new repository**. Make it **public** and name it `webdev-<your faculty number>`.
2. In your new repository, go to **Settings → Collaborators** and add the lecturer.
3. Click **Code → Codespaces → Create codespace on main**. The first start takes a few minutes while the tools are installed.
4. When the terminal shows `Workspace ready`, type `gemini` and follow the sign-in steps on the course setup page.
5. Fill in `AGENTS.md` as you go, and add one entry to `AGENT_LOG.md` and `USAGE.md` after every agent session.

The course setup page explains accounts, sign-in, free limits and what to do if something goes wrong.

## What is already here

| Path | What it is for |
|---|---|
| `.devcontainer/` | The workspace definition: Node 22, Python 3.12, SQLite, Docker, GitHub CLI, Gemini CLI |
| `.gemini/settings.json` | Tells Gemini CLI to read `AGENTS.md`, and where it finds your MCP servers (Exercise 1) |
| `.vscode/mcp.json` | The same for Copilot, if you use it (the key is `servers`) |
| `.github/workflows/ci.yml` | Runs your tests on every push (`npm test` or `pytest`) |
| `AGENTS.md` | Instructions your agent reads every session |
| `SPEC.md` | Your project specification (Exercise 2) |
| `AGENT_LOG.md`, `USAGE.md` | The logs you keep from Exercise 1 on |
| `mcp-server/` | Exercise 1, with `lectures.json`, `messages.jsonl` and the self-check `check.mjs` |
| `checks/` | One self-check per exercise: `node checks/ex2.mjs`, `ex3`, `ex4`, `ex5` |
| `.env.example` | Every environment variable your app needs, with placeholder values |

## Check yourself before you hand in

Each exercise ships a self-check you run from the repository root:

```bash
node mcp-server/check.mjs -- node mcp-server/server.js   # exercise 1
node checks/ex2.mjs                                       # exercise 2
node checks/ex3.mjs                                       # exercise 3
node checks/ex4.mjs https://your-app.onrender.com         # exercise 4, URL optional
node checks/ex5.mjs                                       # exercise 5
```

They check **structure**, not quality: they catch a missing section, an unwritten acceptance criterion or a fix committed without its test. Passing them is the minimum, and the rubric on the exercise page decides the mark.

## Submitting

Push your work, then tag the commit you submit and push the tag:

```bash
git tag ex1
git push origin ex1
```

Use `ex1` … `ex5`. Submit the repository link on the course platform. A later push does not change what you submitted.

## Save your free quota

Stop the codespace when you finish (**Code → Codespaces → … → Stop codespace**) and delete codespaces you no longer need.
