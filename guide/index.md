# What is Go Mode?

Go Mode provides a native Android shell and reusable voice infrastructure for backend-hosted web applications. Add a service URL, load its web frontend, and use the host’s tools through MCP.

The host keeps its accounts, authorization, product APIs, and content. Go Mode owns discovery, native integration, voice transport, and reusable protocol packages.

## Choose your starting point

- **Use an existing host:** [build and configure the Android app](./android).
- **Connect your own application:** [serve the discovery manifest](./host), then add [authentication](./authentication) and [MCP tools](./skills).
- **Add conversation:** install a standalone [voice gateway](./voice) or embed one in your host, then choose the voice setup in the [Android app](./android).
- **Integrate a browser frontend:** use the [SolidJS package and generated SDKs](./sdk).

## How caic fits

[caic](https://caic.xyz) manages coding agents in isolated containers. It is one Go Mode host. caic owns its task list, task detail, diffs, widgets, and coding-agent APIs; Go Mode supplies the Android shell and shared voice infrastructure.

For coding-agent setup, use [caic’s documentation](https://docs.caic.xyz/caic/installation). For the shared platform, stay here.

## Current scope

The Android app loads each service’s first advertised MCP tool group. Every saved service stays signed in, and one voice conversation follows the service on screen. Voice uses a realtime model, or separate recognition, language model, and speech stages that each run on the gateway or the phone. A car can start voice by dialing a saved service. Hosts can publish actionable alerts that open the right page in the right service. Context-based progressive skill activation and external-browser provider login are design work, not current setup steps.

[Architecture](./architecture) explains the boundaries. [Troubleshooting](./troubleshooting) covers failed discovery, authentication, and voice connections.

## License

Go Mode, including its Go packages, browser package, generated SDKs, and Android app, is licensed under the [GNU Affero General Public License v3](https://github.com/gomodedev/gomode/blob/main/LICENSE). Review its terms before you embed Go Mode in your host. For a commercial license, contact [licensing@gomode.dev](mailto:licensing@gomode.dev).
