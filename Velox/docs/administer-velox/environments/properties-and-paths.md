---
title: "Environment properties and paths"
description: "Configure named Velox system connections and their production and test database roles."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Connections.json, environment, test configuration, production configuration]
---

Velox reads `C:\ProgramData\Velox\Config\Connections.json` to select a named system connection and its production/test database roles. Treat the file as controlled configuration: it can contain encrypted credential values and a wrong role mapping can direct work to the wrong environment.

## Connection fields

| JSON field | Requirement and meaning | Validation/runtime effect |
| --- | --- | --- |
| `Key` | Unique name used by Designer/service selection and service `-c` parameter | Must identify the intended profile; missing service key prevents normal startup |
| `DisplayName` | Non-empty user-facing name | A blank display name makes the connection invalid |
| `ConfigNum` | Non-zero configuration number | Zero makes the connection invalid |
| `ProdLabel`, `TestLabel` | Labels shown for the two contexts | Make the environment explicit; do not use a label as proof of database identity |
| `Config`, `ConfigTest` | Database keys for VxConfig production/test | Each must resolve to a `Databases` entry |
| `Log`, `LogTest` | Logical log database keys | Parsed and retained; reviewed core `VX_LOG*` persistence currently follows the active configuration connection, so verify the deployed implementation/schema |
| `Data`, `DataTest` | VxData database keys | Each must resolve to the correct business-data environment |

## Database profile fields

| JSON field | Type/default | Effect |
| --- | --- | --- |
| `Key` | string / empty before load | Lookup key referenced by connection roles |
| `HostType` | DB type / Microsoft SQL Server enum first value | Selects the database engine/provider branch |
| `Host`, `Database` | string / empty | Server and database/catalog |
| `AuthType` | SQL auth enum / Windows authentication | Chooses authentication mode |
| `Username`, `Password` | string / empty; password stored encrypted by Velox tooling | Credentials for modes that require them; never place plaintext in documentation |
| `Driver` | string / empty, uppercased on load | Driver/provider selection input |
| `TrustCertificate` | Boolean / `false` | Relaxes certificate trust for applicable SQL connections; use only under an approved security decision |

## Safe change procedure

1. Back up the file with access controls that match its sensitivity.
2. Validate JSON syntax and confirm every referenced database key exists.
3. Compare actual host/database values, not only `ProdLabel` and `TestLabel`.
4. Test under the interactive and service identities.
5. Restart processes that loaded the old file and verify the selected key/context before any write or Flow run.

See [environment validation](validation.md) before promotion or service start.
