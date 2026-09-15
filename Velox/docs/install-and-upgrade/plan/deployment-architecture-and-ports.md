---
title: "Deployment architecture and ports"
description: "Plan Velox processes, databases, network paths and listener ports before installation."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [deployment architecture, ports, Velox Service, Velox API Service]
---

A Velox deployment combines Windows executables, shared ProgramData, one or more system-connection profiles and SQL databases. Plan these dependencies together: a service can start at Windows level while still being unable to load its selected Velox configuration.

## Components and dependencies

| Component | Role | Required dependencies | Network exposure |
| --- | --- | --- | --- |
| Velox Designer (`Velox.exe`) | Interactive configuration, testing and administration | `Connections.json`, VxConfig access, runtime folders and type-specific drivers | Outbound database and integration endpoints; local service control |
| Velox Service | Schedules, file monitors, inbound Transports and outbound delivery | A valid `-c` connection key, General Setup, VxConfig/Log/Data access, folder rights and external endpoint access | Normally outbound; inbound exposure depends on configured protocols/endpoints |
| Velox API Service | Hosts REST-enabled Flows | A valid `-c` key, General Setup, REST Flow definitions and database/folder rights | Inbound HTTP listener on the configured API port |
| VxConfig | Stores module and Flow configuration | Supported SQL database and schema | SQL listener used by all participating Velox processes |
| VxLog | Logical log role in connection configuration | Current reviewed core persistence uses the active configuration connection for `VX_LOG*`; verify the deployed schema and implementation | SQL listener |
| VxData | Stores standardised business transaction data | Deployment-specific VxData schema and permissions | SQL listener and, when deployed, the VxData portal |
| `C:\ProgramData\Velox\` | Shared configuration, certificates, files, schemas, scripts, Help and temporary/runtime data | NTFS rights for interactive and service identities | File-system or share access only |

## Port plan

Record every port in the environment runbook. Velox does not define the database, SMTP, proxy or remote Transport port; use the value approved for that dependency.

| Port or channel | Source of value | Verified Velox behaviour |
| --- | --- | --- |
| Velox API listener | General Setup `VeloxAPIPort`; default `8359` | The API Service falls back to `8359` when the stored port is `0`. Restart the API Service after endpoint/listener changes. |
| Velox Web URL | General Setup domain and port; default web port `443` | Used to derive the web URL and OpenAPI export location. It is not proof that a web server or TLS termination is configured. |
| SQL database | `Connections.json` database profile and driver/provider | Designer and services must reach the selected Config/Log/Data roles. |
| SMTP | General Setup; default SMTP port `587` | Used only when SMTP is active and the chosen authentication/TLS settings are valid. |
| Proxy | General Setup host/port | Applied by consumers that read the shared proxy configuration. |
| Transport endpoint | Concrete Transport module | FTP defaults to `21`, SFTP to `22` and POP3 to `110` in reviewed defaults; always use the endpoint owner's approved value. |

:::caution TLS termination is an architecture decision
`VeloxAPIEnableSSL` changes the derived URL, but the reviewed core listener startup did not bind the configured certificate or SSL flag. Do not expose the API directly on the assumption that this checkbox provides working TLS. Use an approved gateway/reverse-proxy design and validate the deployed path.
:::

## Validation checklist

1. Resolve the service identities, SQL profiles, ProgramData path and all remote endpoints from the target host.
2. Confirm firewall rules are scoped to the necessary source, destination and port.
3. Confirm the chosen API port is free before service start.
4. Confirm the database schema is current before starting services; the reviewed service startup does not perform the database upgrade check.
5. Record a connection and permission test for each process identity.

Continue with [service accounts](service-accounts.md), [runtime folders](runtime-folders.md) and [service configuration](../install/configure-services.md).
