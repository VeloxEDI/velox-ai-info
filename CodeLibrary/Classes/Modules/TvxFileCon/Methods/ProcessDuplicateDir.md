---
title: ProcessDuplicateDir
description: Returns the configured duplicate-file directory after default-directory and action/system tag expansion.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, duplicate-directory, tags]
---

```Delphi
function ProcessDuplicateDir: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ProcessDuplicateDir
  else
    Value := '';
end;
```

### Usage

`ProcessDuplicateDir` returns the configured duplicate-file directory after default-directory and action/system tag expansion.

**Errors, security and quirks**

- Results can change with time, locals, globals, variables, configuration or fresh-value tags.
- Invalid/missing dynamic tags can raise. No local exception handler or fallback directory exists.
- The returned path may be empty, relative, inaccessible or outside the intended root; scripts must not treat expansion as validation/authorisation.
- Do not place secret or untrusted transaction text in filesystem paths. Movement/logging can expose it.
- A trailing delimiter is normally stored by the property setter but is not reasserted after expansion.

### Additional Technical Info
`ProcessDuplicateDir` resolves the FileCon's stored [`DuplicateDir`](../Properties/DuplicateDir.md) template for the current execution context.

**Implementation and use**

The method copies the stored duplicate-directory string, replaces `<DEFAULTDIR>` case-insensitively with the setup default file path captured at module initialisation, then expands action-local and general system/global/setup/date/secret/constant tags. It does not process definition data-field tags.

Native audit routing selects this value when the log status type is duplicate. The method itself does not create/check the directory, classify a file as duplicate, move a file or alter log status.

**Performance and concurrency**

String/tag processing performs no filesystem I/O. The context is mutable and unsynchronised; capture one result for one operation rather than reevaluating it across threads or long-running work.

**Related entries**

- [`ProcessAuditDir`](ProcessAuditDir.md), [`ProcessIssueDir`](ProcessIssueDir.md) and [`ProcessErrorDir`](ProcessErrorDir.md) — other routing destinations.
- [`TvxFileCon`](../../TvxFileCon.md) — full file lifecycle.

<small>Created 2026-07-15</small>
