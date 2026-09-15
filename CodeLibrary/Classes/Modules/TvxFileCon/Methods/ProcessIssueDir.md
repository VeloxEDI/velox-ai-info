---
title: ProcessIssueDir
description: Returns the configured issue directory after default-directory and action/system tag expansion.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, issue-directory, tags]
---

```Delphi
function ProcessIssueDir: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ProcessIssueDir
  else
    Value := '';
end;
```

### Usage

`ProcessIssueDir` returns the configured issue directory after default-directory and action/system tag expansion.

**Errors, security and quirks**

- Tag values are live and repeated calls can differ; missing/invalid dynamic tags can raise.
- The return value is not canonicalised, root-restricted or permission-tested. Empty, relative and inaccessible results remain possible.
- Do not embed secrets or untrusted transaction text in the path; later movement and logging can disclose it.
- Windows service identity and UNC/mapped-drive behaviour apply during later I/O.
- The property setter normally stores a trailing delimiter; expansion does not guarantee it remains present.

### Additional Technical Info
`ProcessIssueDir` resolves the FileCon's stored [`IssueDir`](../Properties/IssueDir.md) template for the current execution context.

**Implementation and use**

The method copies the stored issue-directory string, replaces `<DEFAULTDIR>` case-insensitively with the setup default file path captured at module initialisation, then expands action-local and general system/global/setup/date/secret/constant tags. It does not process definition data-field tags.

Native audit routing selects this directory when the log status type is issue. The method itself neither decides issue status nor creates, checks or moves anything.

**Performance and concurrency**

The call performs no filesystem I/O. General/secret lookup cost and mutable unsynchronised context still apply.

**Related entries**

- [`ProcessAuditDir`](ProcessAuditDir.md), [`ProcessDuplicateDir`](ProcessDuplicateDir.md) and [`ProcessErrorDir`](ProcessErrorDir.md) — other outcome destinations.
- [`TvxFileCon`](../../TvxFileCon.md) — routing/lifetime model.

<small>Created 2026-07-15</small>
