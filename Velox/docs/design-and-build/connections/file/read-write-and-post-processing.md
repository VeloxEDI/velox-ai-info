---
title: "File read, write and post-processing behaviour"
description: "Understand File Connection audit, Transport, error, issue, duplicate and temporary folders."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [audit folder, error folder, Transport folder, file lifecycle]
---

| Property | Default | Purpose and runtime consequence |
| --- | --- | --- |
| `AuditDir` | `<DEFAULTDIR>\AUDIT\` | Destination for successfully audited source files |
| `TransportDir` | `<DEFAULTDIR>\TRANSPORT\` | Staging/destination for files registered for outbound delivery; not created by the standard directory check |
| `ErrorDir` | `<DEFAULTDIR>\ERROR\` | Destination for errored files |
| `IssueDir` | `<DEFAULTDIR>\ISSUE\` | Destination for files requiring issue handling |
| `DuplicateDir` | `<DEFAULTDIR>\DUPLICATE\` | Destination for duplicate files |
| `TempDir` | main folder plus `TEMP\` | Temporary processing location |

Runtime state determines whether the current file moves to audit, Transport or error. A Transport move disables the audit move in the reviewed state logic. On reset, error movement is enabled while audit/Transport movement is disabled; the executing Flow/Definition/Transport changes those flags according to outcome.

Create and permission every directory explicitly. `CheckDirectories` creates main, audit, issue, error, duplicate and temp folders but intentionally does not create the Transport folder by default.

After a test, verify both the Flow status and physical file location. Recovery must account for database side effects and any outbound queue item before moving a file back for reprocessing.
