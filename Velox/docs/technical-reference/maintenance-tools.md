---
title: "Velox maintenance tools"
description: "Reference folder, resave, relation, password, Transport, XSD and EDI utilities"
sidebar_position: 80
slug: /advanced/maintenance-tools
classification: public
status: approved
owner: Cam Hart
keywords: [maintenance, tools, xsd]
---

Advanced tools can rewrite configuration or data and require backups, test-context use and change approval.

| Tool | Purpose/effect | Required checks |
| --- | --- | --- |
| **Resave modules** | Loads and rewrites selected module serialisation | Full configuration backup; identified compatibility/repair reason; capture failures; reopen and test every affected type |
| **Unused Modules** / **Check Usage** | Reads relation/usage candidates | Results depend on current relation metadata; manually verify scripts, external callers and linked relationships before archive/delete |
| **Sync Relations** | Rebuilds module relationship metadata | Back up, run in controlled context, compare usage before/after and investigate lost/unexpected relations |
| **Create All File Folders** | Creates configured File Connection folders | Runs with interactive identity; validate effective paths and then service-account access/ACL separately |
| **Update Passwords** | Applies credential changes across selected scope | Protect input, record exact scope, back up, coordinate rotation and test all dependent runtime Connections/Transports |
| **Send Outbound Transports Now** | Prompts queued outbound processing | Record queue selection and reconcile receiver state; monitor one item before releasing a backlog |
| **Create XSD** | Infers schema from XML samples | Use sanitised representative samples; generated schema is a draft requiring standards/data-owner/security review |
| **Expand/Contract EDI File** | Transforms EDI presentation for inspection/use | Work on copies, verify separators/release/message version and byte-level output; do not overwrite sole source evidence |
| **Convert PuTTY Key** | Converts supported SSH key material | Use a protected working directory, validate output format/passphrase/ACL and securely remove temporary copies under policy |

## Change procedure

1. Identify the exact symptom and tool effect; do not run a broad utility experimentally in production.
2. Back up affected configuration/files and record context, version, counts and owner approval.
3. Use test/non-production first with a small scope.
4. Capture results/errors, reopen affected modules and run representative runtime tests.
5. Reconcile queue/files/external state and retain the change evidence.

The visible **Create Transports** utility is customer/scenario-specific and is not a general supported creation workflow. The inactive/unconfirmed Database Upgrade UI is not documented as a normal tool; use the approved upgrade runbook.

- [Manage modules](../administer-velox/modules-and-folders/lifecycle-actions.md)
- [Maintenance and recovery](../administer-velox/maintenance-and-recovery.md)
- [Diagnostics](../operate-and-troubleshoot/diagnostics.md)
- [Configuration governance](../promote-and-govern/governance-approvals-and-evidence.md)
