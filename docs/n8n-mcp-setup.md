# n8n MCP Server: Control Your Workflows from Claude Code

This connects Claude Code (web) to your self-hosted n8n on Hostinger through
n8n's native **MCP Server Trigger** node. Once wired, Claude can call the tools
your n8n workflow exposes over MCP.

Your endpoint:

```
https://n8n-j9pt.srv1818828.hstgr.cloud/mcp-server/http
```

It requires **Bearer token** authentication (confirmed by the
`WWW-Authenticate: Bearer realm="n8n MCP Server"` response header).

## How the pieces fit

```
Claude Code (web)  --HTTP + Bearer token-->  n8n MCP Server Trigger  -->  your tools/sub-workflows
        |                                              |
   .mcp.json                                   MCP Server Trigger node
   N8N_MCP_TOKEN env var                        (Bearer Auth credential)
```

- `.mcp.json` (in the repo root) tells Claude Code to connect to the URL as an
  HTTP MCP server and send the `Authorization: Bearer <token>` header.
- The token itself is **never committed**. It comes from the `N8N_MCP_TOKEN`
  environment variable, which you set in your environment config.

## Step 1: Get the bearer token from n8n

1. Open your n8n workflow that starts with the **MCP Server Trigger** node.
2. Open that node. Under **Authentication**, it should be set to **Bearer Auth**.
3. Open the attached credential. The **Bearer Token** value there is what Claude
   needs. Copy it. (If none exists, create a Bearer Auth credential with a long
   random string as the token, then save the workflow and make sure it is
   **Active**.)

## Step 2: Set the token as an environment variable

The token must be available to this session as `N8N_MCP_TOKEN`.

For Claude Code on the web, add it in your environment configuration (the same
place other env vars for this environment are set). See
https://code.claude.com/docs/en/claude-code-on-the-web for where environment
variables live for your setup.

Set:

```
N8N_MCP_TOKEN=<the bearer token from step 1>
```

Do not paste the token into chat or commit it anywhere.

## Step 3: Load the MCP server

`.mcp.json` is read at session start. After the env var is set, start a fresh
Claude Code session on this repo. Claude will pick up the `n8n` MCP server and
prompt to approve it (project MCP servers require approval the first time).

## Step 4: Verify

Ask Claude: "list the n8n MCP tools" or "what tools does the n8n server expose".
If the handshake worked, Claude will list the tools your MCP Server Trigger
workflow connected. If you get a 401, the token is wrong or the workflow is not
active. If you get a connection error, check the URL and that the workflow is
Active in n8n.

## Two MCP servers, two jobs

This repo wires up **both** ways of connecting:

| Server | Transport | What it does | Secret |
|---|---|---|---|
| `n8n` | HTTP (MCP Server Trigger) | Call the specific tools/sub-workflows your trigger workflow exposes | `N8N_MCP_TOKEN` |
| `n8n-manage` | npx `n8n-mcp` (REST API) | Full instance control: list, create, edit, validate, run any workflow | `N8N_API_KEY` |

### Getting the REST API key (for `n8n-manage`)

1. In n8n, open **Settings -> n8n API**.
2. Click **Create an API key**, copy it.
3. Set it as the `N8N_API_KEY` environment variable (do not commit it).

This key is **different** from the bearer token in Step 1. The bearer token is
for the MCP Server Trigger node; the API key is for the n8n REST API.

`n8n-manage` runs via `npx -y n8n-mcp`, which downloads the package on first use.
The `N8N_API_URL` (`https://n8n-j9pt.srv1818828.hstgr.cloud`) is public, so it is
hardcoded in `.mcp.json`; only the API key comes from the environment.

## The `.mcp.json` entry

```json
{
  "mcpServers": {
    "n8n": {
      "type": "http",
      "url": "https://n8n-j9pt.srv1818828.hstgr.cloud/mcp-server/http",
      "headers": {
        "Authorization": "Bearer ${N8N_MCP_TOKEN}"
      }
    },
    "n8n-manage": {
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://n8n-j9pt.srv1818828.hstgr.cloud",
        "N8N_API_KEY": "${N8N_API_KEY}"
      }
    }
  }
}
```
