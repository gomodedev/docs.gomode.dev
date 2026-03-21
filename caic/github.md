# GitHub Integration

gomode supports GitHub for automatic PR creation and CI monitoring. The forge is detected automatically from the repository's git remote URL.

## PR creation

After a successful sync to the task's branch, gomode automatically opens a pull request against the base branch. The title comes from the task title and the body from the agent's result summary. The PR number appears as a link in the task detail header.

## CI monitoring

After PR creation, gomode polls CI status every 15 seconds (GitHub check-runs):

- **CI: passed** — all checks succeeded; the agent is notified with a summary
- **CI: failed** — one or more checks failed; the agent is notified with names and URLs of failing checks so it can act on them

## Integration modes

gomode supports three GitHub integration modes. They are not mutually exclusive — PAT or OAuth handles forge operations while GitHub App handles webhooks independently.

| | **GitHub PAT** | **GitHub OAuth** | **GitHub App** |
|---|---|---|---|
| **Use case** | Single-user | Multi-user with login | Org-wide automation |
| **User auth** | ❌ | ✅ Login via GitHub | ❌ |
| **Webhooks** | ❌ polling only | ❌ polling only | ✅ |
| **Auto task creation** | ❌ | ❌ | ✅ |
| **Env vars** | `GITHUB_TOKEN` | `CAIC_EXTERNAL_URL` + `GITHUB_OAUTH_CLIENT_ID` + `GITHUB_OAUTH_CLIENT_SECRET` + `GITHUB_OAUTH_ALLOWED_USERS` | `CAIC_EXTERNAL_URL` + `GITHUB_APP_ID` + `GITHUB_APP_PRIVATE_KEY_PEM` + `GITHUB_WEBHOOK_SECRET` |

## GitHub PAT

[Create a fine-grained token](https://github.com/settings/personal-access-tokens/new) with `pull_requests: write` and `checks: read` permissions.

```bash
GITHUB_TOKEN=<your-token>
```

If unset, gomode auto-detects the token from `gh auth token`.

## GitHub OAuth

1. Create a [GitHub OAuth app](https://github.com/settings/applications/new)
   - Callback URL: `https://<your-domain>/api/v1/auth/github/callback`
2. Set environment variables:
   ```
   CAIC_EXTERNAL_URL=https://<your-domain>
   GITHUB_OAUTH_CLIENT_ID=<client-id>
   GITHUB_OAUTH_CLIENT_SECRET=<client-secret>
   GITHUB_OAUTH_ALLOWED_USERS=alice,bob
   ```

## GitHub App

Enables real-time webhooks and automatic task creation for issues, PRs, and `@gomode` mentions.

1. [Create a GitHub App](https://github.com/settings/apps/new)
   - Webhook URL: `https://<your-domain>/webhooks/github`
   - Permissions: Issues (read/write), Pull requests (read/write), Checks (read)
   - Events: Issues, Pull requests, Issue comments, Check suites
2. Generate a private key from the app settings
3. Install the app on your org or repositories (app must be public for org installs)
4. Set environment variables:
   ```
   GITHUB_WEBHOOK_SECRET=<webhook-secret>
   GITHUB_APP_ID=<app-id>
   GITHUB_APP_PRIVATE_KEY_PEM=private-key.pem  # relative to ~/.config/gomode/
   GITHUB_APP_ALLOWED_OWNERS=my-org  # optional
   ```

Automatic task creation triggers:

| Event | Condition | Action |
|---|---|---|
| Issue opened | Issue has `gomode` label | Agent fixes the issue |
| PR opened/reopened | Targets the default branch | Agent reviews/fixes the PR |
| Comment created | Body contains `@gomode` | Agent acts on the comment |
