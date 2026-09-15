---
title: "Logging"
description: "Functions for recording flow messages, statuses, issues, file events and SQL diagnostics in the current Velox execution context."
sidebar_position: 18
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - issues
  - status
  - diagnostics
---

The Logging group records information against the current Velox flow, action or mapping context. Entries range from notes that do not change status, through warning/issue/error/cancel states, to deferred invoice issues, file-audit events and SQL trace text.

## Choosing an entry

- Use [`LogInfo`](Logging/LogInfo.md), [`LogHighlight`](Logging/LogHighlight.md) or test-only [`LogTest`](Logging/LogTest.md) for informational diagnostics with their documented visibility.
- Use [`LogWarning`](Logging/LogWarning.md), [`LogIssue`](Logging/LogIssue.md), [`LogError`](Logging/LogError.md), [`LogDuplicate`](Logging/LogDuplicate.md) or [`LogCancel`](Logging/LogCancel.md) only when that exact flow-status consequence is intended.
- Use the file-event entries to queue audit facts; they do not open, create, download or verify the named file.
- Use [`LogSQL`](Logging/LogSQL.md) and [`LogSQLComment`](Logging/LogSQLComment.md) to append diagnostic trace text when SQL logging is enabled. They never execute SQL.
- Use [`ScriptFieldName`](Logging/ScriptFieldName.md) to describe the current field/view context for a message.

## Status and processing effects

Logging is not a single severity-neutral operation. Some entries only append an item, some raise the overall flow status, and error/cancel paths influence later processing. Existing more-severe status can also affect whether a new call changes the overall state. Read the chosen child page rather than inferring behavior from the visible name.

Invoice issues are queued for deferred persistence and successful finalization rather than immediately proving a VxData row exists. The current `InvoiceLineIssue` script registration is incompatible with its intended native method, and `LogFileEvent` has a documented script/native enumeration ordinal mismatch. Those defects make the affected child pages mandatory reading.

## Context, privacy and concurrency

Most entries require an active scripter/action/log context. A callable name being available does not guarantee it has meaningful current field, invoice or mapping state in every event.

Logs are operational records. Never include credentials, authentication headers, encryption keys or unrestricted payload/customer data. Prefer identifiers and bounded summaries that let support staff diagnose the flow without creating a second sensitive-data store.

Concurrent flow executions have separate contexts, but log ordering across workers and external persistence should not be treated as a transaction boundary. A log call does not roll back file, email, process or database effects.
