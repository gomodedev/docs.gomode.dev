# MCP and skills

Go Mode connects native features to your host through MCP. The host defines tools and resources; the shell and voice clients execute the tools the host advertises.

## Advertise an endpoint

Each `webShell.toolGroups` entry includes:

- `name` and an optional description;
- `endpoint`, an absolute path or HTTP(S) URL;
- `protocolVersion`, the version implemented by that endpoint;
- `authRequired`;
- an optional `skillUrl` pointing to a `SKILL.md` file.

The Android shell currently uses the first tool group and registers the tools returned by that endpoint. Progressive activation, location triggers, and selective multi-skill activation remain planned behavior.

The reusable [`mcp` package](https://github.com/maruel/gomode/tree/main/mcp) supplies HTTP transport and DTOs. Tool names, schemas, access rules, and side effects belong to your host. Keep your advertised protocol version aligned with the implementation.

The names `hang_up`, `list_servers`, and `switch_server` are reserved for native voice commands. Use other names for your MCP tools and frontend tools.

## Service resources

Expose `gomode://items` to give native voice a bounded snapshot of the current work:

| Field            | Meaning                                                |
| ---------------- | ------------------------------------------------------ |
| `id`             | Stable item identity                                   |
| `reference`      | Optional spoken reference, such as “Task #3”           |
| `title`          | User-visible label                                     |
| `state`          | Optional user-visible state                            |
| `needsAttention` | Whether the user needs to act                          |
| `omittedCount`   | Authoritative count excluded from the bounded snapshot |
| `moreItemsHint`  | How to retrieve omitted or newer items                 |

The host controls ordering, attention priority, bounds, and authorization. The gateway transports context as opaque text; it does not fetch or interpret your product state.

For notifications, expose `gomode://notifications` as an authoritative JSON array of the alerts that are actionable now. Each alert has `id`, `title`, and `body`. An optional `itemId` identifies the underlying work across alert occurrences, an optional `url` is a host-owned destination resolved against the saved service URL, and an optional `expiresAt` ends delivery.

Your host owns the actionable state, the retention, and the expiry. The shell validates the whole snapshot before deduplicating by `id`, notifies only for alerts it has not posted yet, updates posted text without another sound, dismisses alerts you dropped, and honors expiry. A failed read supplies no snapshot, so it never withdraws an alert. Put display numbers in the title and stable IDs in the destination, because Android opens only HTTP(S) destinations on the saved service’s origin. Signal changes with `notifications/resources/updated`.

Subscriptions invalidate resources: after a resource update, clients read the current value again. They are not a second source of product truth.

## Skill files

A `SKILL.md` file combines model instructions with structured frontmatter for MCP server wiring and tool allowlists. The schema supports local activation hints, but the current Android shell does not progressively activate skills from those hints.

Start from [the upstream tasks example](https://github.com/maruel/gomode/blob/main/examples/tasks/SKILL.md) and [the generated discovery SDK reference](https://github.com/maruel/gomode/blob/main/sdk/gomode/API.md). Adapt instructions and tool names to your own service.

Treat skill instructions, tool descriptions, and resource text as untrusted input. Authorization belongs at every host operation that reads private data or causes a side effect.
