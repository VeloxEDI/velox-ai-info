---
title: "Velox runtime folders"
description: "Understand installed paths and configurable runtime assets"
sidebar_position: 40
slug: /installation/runtime-folders
classification: public
status: approved
owner: Cam Hart
keywords:
  - "programdata"
  - "folders"
  - "configuration"
---

Velox uses a shared application-data hierarchy for configuration files, runtime assets, logs, schemas, scripts and installed help. The confirmed default base path is `C:\ProgramData\Velox\`. A configured installation can use a different shared base folder, so confirm the actual location before changing files or permissions.

This reference helps Windows administrators and implementers identify the purpose of confirmed folders. It does not replace an installation or backup runbook.

## Confirmed shared folders

| Relative path | Purpose | Operational consideration |
| --- | --- | --- |
| `Config\` | System connection and other file-based configuration | Protect configuration and any sensitive values; changes can affect Designer and services |
| `Config\Velox\` | Velox configuration-update assets | Use only through an approved update workflow |
| `Data\` | Shared runtime data assets | Confirm ownership before changing or removing files |
| `Data\Velox\` | Velox data-update assets | Use only through an approved data-update workflow |
| `Files\` | General file-processing area | Actual integrations can use other configured locations |
| `Certificate\Private\` | Private certificate material | Restrict access to approved accounts; never share private material |
| `Certificate\Public\` | Public certificate material | Validate ownership and expiry before use |
| `Compare\` | Configuration comparison output | Treat exports as configuration information |
| `Cookies\` | Runtime cookie storage where used | May contain sensitive session material; restrict and sanitise |
| `Excel\` | Excel templates and related assets | Keep templates aligned with their File Definitions |
| `Help\CodeLibrary\` | Installed scripting reference used by Designer | The installed snapshot can differ from the repository reference |
| `Log\` | File-based logs where configured | Apply approved retention and sanitisation controls |
| `Resource\` | Shared runtime resources | Change only when the owning workflow identifies the asset |
| `Schema\` | XML and other schema assets | Preserve filenames and dependencies used by Definitions |
| `Script\` | Shared script assets | Review and test changes before runtime use |
| `Temp\` | Temporary runtime files | Do not treat temporary content as an authoritative record |

User exports can default to an `Exports` folder on the current user's desktop. That user-local location is separate from the shared ProgramData hierarchy.

## Installed assets and configured paths

The installation media can include additional folders such as testing assets, configuration templates, database material, schemas, scripts and Excel files. Their presence does not make every item a supported default or production requirement.

Connections and modules can point to folders outside `C:\ProgramData\Velox\`. A File Connection, Transport or General Setup value is authoritative for that configured workflow. Do not move a folder merely to match the default hierarchy.

## Permissions

Designer uses the interactive Windows user's access. Background processing uses the account assigned to Velox Service or Velox API Service. Grant each account only the folders and operations it requires.

For shared or network paths, verify access as the actual service account. A successful interactive file operation does not prove that background processing can read, create, move or delete the same files.

:::caution Runtime impact
Renaming, moving or restricting a configured folder can stop Flows, file monitors, Transports, schemas, scripts or the Code Library from loading. Check module usage and service dependencies before changing the filesystem.
:::

## Backup and recovery boundaries

Filesystem backup alone does not capture Velox modules stored in configuration databases or business data held in VxData and other connected databases. Use an approved recovery plan covering both databases and required file assets.

Do not delete temporary, log or update folders solely because their names suggest that they are disposable. Confirm the owning process, retention policy and current activity first.

## Related references

- [Install the Velox platform](../install/install-velox.md)
- [Velox maintenance tools](../../technical-reference/maintenance-tools.md)
- [Troubleshoot the Code Library](../../operate-and-troubleshoot/code-library-troubleshooting.md)
