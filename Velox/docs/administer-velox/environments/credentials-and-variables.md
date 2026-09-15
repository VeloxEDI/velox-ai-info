---
title: "Environment-specific credentials and values"
description: "Manage credentials, Variable Groups and other environment-specific Velox values without copying secrets between contexts."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [credentials, variables, environment-specific values, secrets]
---

Keep endpoint addresses, database credentials, certificates and business variables specific to the environment that consumes them. Promotion should move structure and reviewed references without turning test secrets or endpoints into production values.

## Value locations

| Location | Typical values | Change/reload boundary |
| --- | --- | --- |
| `Connections.json` | Config/Log/Data hosts, databases and authentication | Reload by restarting/reopening the consuming process |
| General Setup | SMTP, proxy, API/web, Azure/key-vault, certificates and shared runtime settings | Many consumers load at process/service startup; use the setting-specific page |
| DB/Transport modules | Endpoint, username, encrypted password, TLS/key files and protocol options | Save module; restart or resynchronise the owning service when live refresh is not verified |
| Variable Groups | Typed values referenced by tags/scripts | Reloaded when switching environment; services maintain runtime caches |
| Windows/service configuration | Service identity, environment variables and service parameters | Windows/service restart |

## Rules

- Never paste production credentials into test to make a test pass.
- Store passwords through the Velox control that encrypts them; encryption is not a substitute for access control.
- Keep private keys and credential-bearing configuration readable only by the required identities.
- Use clear environment-specific names and validate actual endpoints after promotion.
- Treat exports as sensitive: configuration templates can contain dependency and environment information.

After changing a value, test the exact runtime identity and consumer. A successful Designer test under your account does not prove that Velox Service can read the same folder, certificate or secret.
