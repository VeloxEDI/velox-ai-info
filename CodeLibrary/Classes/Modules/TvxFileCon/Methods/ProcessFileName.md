---
title: ProcessFileName
description: Expands FileCon counters, current definition data and action/system tags in a filename and optionally sanitises it.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - file-connection
  - filename
  - tags
  - counter
---

```Delphi
function ProcessFileName(const aFileName: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ProcessFileName('order-<FILENO>-<YYYY><MM><DD>.xml')
  else
    Value := '';
end;
```

### Usage

`ProcessFileName` expands FileCon counters, current definition data and action/system tags in a filename and optionally sanitises it.

**Processing order**

1. If `<FILENO>` exists (case-insensitive), replace every occurrence with the current file number and advance that number once. Reset normally starts it at 1.
2. If `<COUNTER>` exists, replace every occurrence with the current separate counter value. This method does not increment that counter; Velox `FileSavePath` prepares it before generating an output path.
3. When FileCon belongs to a data definition, replace data-field tags using its current output record.
4. Process action-local, global, variable, built-in/setup/date, Azure-secret and Velox-constant tags through the context.
5. Velox normally trims the result and replaces control characters, non-printable or non-ASCII characters, and characters invalid in a Windows filename with `-`.

**Result limitations**

The result is a filename string only. This method does not combine it with a directory, make it unique, check reserved device names, enforce filesystem/path length, test access/existence or write a file. Velox `FileSavePath` performs separate directory combination and optional unique-name handling.

Because slash/backslash/colon are replaced under the default safe-name policy, do not pass a full path expecting it to remain a path. Unicode/non-ASCII filename characters are also replaced by Velox.

**State, errors and quirks**

- Evaluating a template containing `<FILENO>` consumes a number even if no file is later saved. Calls without that tag do not advance it.
- Direct calls do not advance `<COUNTER>`; repeated results can share its current value.
- Data-tag results depend on the owning definition and current output record; a standalone or module-level FileCon skips this pass.
- General tag expansion can generate a new GUID/ID or resolve mutable time/locals/globals/secrets on each call and can raise for invalid/missing dynamic tags.
- Unresolved angle-bracket text can be changed by safe-filename conversion after tag processing.
- The method does not change `aFileName`, `FileName` or `CurrentFileName`, but it can advance the `<FILENO>` sequence and resolve local-variable tags.

### Additional Technical Info
`ProcessFileName` expands the filename-specific and general Velox tags in `aFileName`, then applies the connection's native safe-filename policy.

**Security and concurrency**

Do not incorporate untrusted separators/traversal text or secrets and assume sanitisation makes the result authorised; directory selection and service permissions are separate. Counter, record and local context are unsynchronised, so do not call concurrently on one FileCon.

**Related entries**

- [`ProcessFileDir`](ProcessFileDir.md) — directory processing without data/file-number tags.
- [`FileNo`](../Properties/FileNo.md) — stateful getter/setter behind `<FILENO>`.
- [`FileSaveName`](../Properties/FileSaveName.md) and [`FileSavePath`](../Properties/FileSavePath.md) — native generated output values.
- [`TvxFileCon`](../../TvxFileCon.md) — reset, ownership and side-effect model.

<small>Created 2026-07-15</small>
