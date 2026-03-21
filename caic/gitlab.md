# GitLab Integration

gomode supports GitLab for automatic MR creation and CI monitoring. The forge is detected automatically from the repository's git remote URL.

## MR creation

After a successful sync to the task's branch, gomode automatically opens a merge request against the base branch. The title comes from the task title and the body from the agent's result summary. The MR number appears as a link in the task detail header.

## CI monitoring

After MR creation, gomode polls CI status every 15 seconds (GitLab pipeline statuses):

- **CI: passed** — all checks succeeded; the agent is notified with a summary
- **CI: failed** — one or more checks failed; the agent is notified with names and URLs of failing checks so it can act on them

## Integration modes

| | **GitLab PAT** | **GitLab OAuth** |
|---|---|---|
| **Use case** | Single-user | Multi-user with login |
| **User auth** | ❌ | ✅ |
| **Env vars** | `GITLAB_TOKEN` | `CAIC_EXTERNAL_URL` + `GITLAB_OAUTH_CLIENT_ID` + `GITLAB_OAUTH_CLIENT_SECRET` + `GITLAB_OAUTH_ALLOWED_USERS` |

For self-hosted GitLab, also set `GITLAB_URL=https://<your-gitlab-instance>`.

## GitLab PAT

[Create a personal access token](https://gitlab.com/-/user_settings/personal_access_tokens) with `api` scope.

```bash
GITLAB_TOKEN=<your-token>
```

## GitLab OAuth

1. Create a [GitLab OAuth app](https://gitlab.com/-/user_settings/applications)
   - Redirect URI: `https://<your-domain>/api/v1/auth/gitlab/callback`
   - Scopes: `api`, `read_user`
2. Set environment variables:
   ```
   CAIC_EXTERNAL_URL=https://<your-domain>
   GITLAB_OAUTH_CLIENT_ID=<application-id>
   GITLAB_OAUTH_CLIENT_SECRET=<secret>
   GITLAB_OAUTH_ALLOWED_USERS=alice,bob
   ```

For self-hosted GitLab, also set:
```
GITLAB_URL=https://<your-gitlab-instance>
```

## Webhooks (optional)

Webhooks deliver CI status in real time instead of waiting up to 30s for the next poll cycle.

1. In project **Settings → Webhooks**:
   - URL: `https://<your-domain>/webhooks/gitlab`
   - Secret token: `openssl rand -hex 32`
   - Enable: Pipeline events
2. Set: `GITLAB_WEBHOOK_SECRET=<the secret>`
