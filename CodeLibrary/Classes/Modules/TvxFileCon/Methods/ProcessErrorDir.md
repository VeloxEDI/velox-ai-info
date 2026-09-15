---
title: ProcessErrorDir
description: Returns the configured error directory after default-directory and action/system tag expansion.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, error-directory, tags]
---

```Delphi
function ProcessErrorDir: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ProcessErrorDir
  else
    Value := '';
end;
```

### Usage

`ProcessErrorDir` returns the configured error directory after default-directory and action/system tag expansion.

**Errors, security and quirks**

- Tag evaluation can raise for missing/invalid dynamic values and can produce a different path on later calls.
- No canonicalisation/root containment check prevents relative or out-of-scope results.
- File service identity and Windows UNC/mapped-drive permissions apply only when later I/O occurs.
- Do not include secrets or untrusted transaction fields in error paths; error logs commonly expose destination information.
- The configured setter normally stores a trailing delimiter; this method does not repair one removed by the resolved template/value.

### Additional Technical Info
`ProcessErrorDir` resolves the FileCon's stored [`ErrorDir`](../Properties/ErrorDir.md) template for the current execution context.

**Implementation and use**

The method copies the stored error-directory string, replaces `<DEFAULTDIR>` case-insensitively with the setup default file path captured at module initialisation, then processes action-local and general system/global/setup/date/secret/constant tags. Definition data-field tags are not processed.

Native error routing uses the resolved value when its move-to-error latch is consumed. This call alone does not create the folder, test access/existence, set an error latch/status or move a file.

**Performance and concurrency**

This is string processing without filesystem I/O. Avoid repeated secret/tag lookups and unsynchronised evaluation on one shared FileCon.

**Related entries**

- [`ProcessIssueDir`](ProcessIssueDir.md) and [`ProcessDuplicateDir`](ProcessDuplicateDir.md) — non-standard status destinations.
- [`ProcessFileDir`](ProcessFileDir.md) — primary directory compared by native routing.
- [`TvxFileCon`](../../TvxFileCon.md) — move flags, logs and ownership.

<small>Created 2026-07-15</small>
