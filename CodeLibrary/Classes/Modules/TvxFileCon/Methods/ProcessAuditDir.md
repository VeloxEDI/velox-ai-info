---
title: ProcessAuditDir
description: Returns the configured audit directory after default-directory and action/system tag expansion.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, audit-directory, tags]
---

```Delphi
function ProcessAuditDir: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ProcessAuditDir
  else
    Value := '';
end;
```

### Usage

`ProcessAuditDir` returns the configured audit directory after default-directory and action/system tag expansion.

**Errors, security and quirks**

- Tag values and date/time are evaluated on each call, so repeated calls can differ.
- Missing/invalid dynamic tags can raise; unresolved ordinary text can remain in the path.
- Relative, UNC, mapped-drive and service-account paths retain Windows/service-context constraints.
- A path containing secrets or transaction data can be disclosed in logs and directory names. Do not use untrusted path fragments.
- The stored property setter normally adds a trailing delimiter, but this processor does not enforce one after tag expansion.

### Additional Technical Info
`ProcessAuditDir` resolves the FileCon's stored [`AuditDir`](../Properties/AuditDir.md) template for the current execution context.

**Implementation**

The method copies the stored audit-directory string, replaces `<DEFAULTDIR>` case-insensitively with the setup default file path captured when the module was initialised, then processes the FileCon's action-local and general system/global/setup/date/secret/constant tags.

It does not process definition data-field tags. It returns a string only: it does not create the directory, test existence/access, canonicalise it or move/audit a file.

**Native use**

Normal finalisation uses this directory for ordinary audit outcomes (including the OK/warning branch); issue and duplicate status select their dedicated processed directories instead. Movement compares the processed source and destination strings and can skip when they are equal.

**Performance and concurrency**

Processing is in-memory and does no filesystem I/O, but tag/secret lookups can add cost. Locals and setup/global values are live mutable context; do not share one FileCon unsafely across threads.

**Related entries**

- [`ProcessIssueDir`](ProcessIssueDir.md) and [`ProcessDuplicateDir`](ProcessDuplicateDir.md) — status-specific audit destinations.
- [`ProcessFileDir`](ProcessFileDir.md) — primary/source directory.
- [`TvxFileCon`](../../TvxFileCon.md) — routing and ownership model.

<small>Created 2026-07-15</small>
