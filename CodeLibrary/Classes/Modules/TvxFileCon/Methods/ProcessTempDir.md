---
title: ProcessTempDir
description: Returns the configured temporary working directory after default-directory and action/system tag expansion.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, temporary-directory, tags]
---

```Delphi
function ProcessTempDir: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ProcessTempDir
  else
    Value := '';
end;
```

### Usage

`ProcessTempDir` returns the configured temporary working directory after default-directory and action/system tag expansion.

**Errors, security and quirks**

- Repeated evaluation can change with time/context and invalid/missing dynamic tags can raise.
- A name of "temp" does not make the location private, auto-deleting or safe for secrets.
- No canonicalisation/root containment/access check occurs. The service identity and Windows path rules apply to later I/O.
- Do not use untrusted fragments or secret-bearing tags in a shared temporary path.
- A trailing delimiter is normally stored but is not reasserted after tag expansion.

### Additional Technical Info
`ProcessTempDir` resolves the FileCon's stored [`TempDir`](../Properties/TempDir.md) working-directory template.

**Implementation and use**

The method copies the stored temporary-directory string, replaces `<DEFAULTDIR>` case-insensitively with the setup default file path captured at module initialisation, then processes action-local and general system/global/setup/date/secret/constant tags. It does not process definition data-field tags.

Native directory checking includes this result, but the method itself does not create/check the folder, create a temporary file, guarantee cleanup or isolate concurrent executions. The FileDir setter normally resets TempDir to `<new FileDir>\TEMP\` even if TempDir previously held a custom value; that setter behaviour occurs before this processor.

**Performance and concurrency**

This is string processing only. Separate executions can resolve to the same directory; callers need collision-safe filenames and lifecycle controls in the actual I/O workflow.

**Related entries**

- [`ProcessFileDir`](ProcessFileDir.md) — primary directory from which the native default TempDir is derived.
- [`ProcessFileName`](ProcessFileName.md) — naming/collision limitations.
- [`TvxFileCon`](../../TvxFileCon.md) — state and ownership.

<small>Created 2026-07-15</small>
