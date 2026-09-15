---
title: "Velox installation prerequisites"
description: "Confirm release support, Windows, database, driver and access prerequisites"
sidebar_position: 10
slug: /installation/prerequisites
classification: public
status: approved
owner: Cam Hart
keywords: [prerequisites, windows, database]
---

Confirm every item below against the release-specific support statement before scheduling installation. The product source and distribution contain 32-bit and 64-bit variants and several database drivers, but their presence does not certify every Windows, database or driver combination.

## Go/no-go checklist

| Area | Required evidence |
| --- | --- |
| Release | Approved Velox release, matching architecture and trusted package source/checksum |
| Windows | Supported Windows edition/version, available disk space and restart/change window |
| Database | Supported database product/version, approved VxConfig/VxData lifecycle and backup/restore access |
| Drivers | Required provider/client installed with architecture matching the Velox executable |
| Identity | Named interactive administrator and dedicated service identities with approved rights |
| Network | DNS, ports, proxy/firewall and TLS/certificate requirements agreed for every dependency |
| Filesystem | Application and shared-data locations, backup scope and service-account access agreed |
| Recovery | Tested backups or snapshots and a decision point for rollback |

Do not infer support from a selectable provider, bundled DLL or historical install folder. If the release does not state a supported combination, obtain confirmation from Velox Support before proceeding.

## Related tasks

- [Install the Velox platform](../install/install-velox.md)
- [Configure service accounts](service-accounts.md)
- [Configure databases](../install/configure-databases.md)
