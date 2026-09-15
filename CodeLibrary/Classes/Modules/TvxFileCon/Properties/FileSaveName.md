---
title: FileSaveName
description: Generates a filename from processed FilePattern by deleting question marks and replacing asterisks with one GUID.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, save-name, file-pattern, guid]
---

```Delphi
property FileSaveName: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.FileSaveName
  else
    Value := '';
end;
```

### Usage

`FileSaveName` generates a filename from processed FilePattern by deleting question marks and replacing asterisks with one GUID.

**Limitations and quirks**

- No directory is included and CurrentFileName is not changed.
- The result is not passed through ProcessFileName safe-character conversion, existence checking or unique-name checking.
- Every `*` receives the same GUID, not a different value; GUID string formatting is the Velox representation.
- Only `?` and `*` are removed/replaced. Other invalid/path characters or unresolved tag text can remain.
- General tag expansion can vary per call, expose secrets or raise for missing/invalid dynamic values.
- It does not write/reserve a file or prove that a transport used the value.

### Additional Technical Info
`FileSaveName` creates a candidate standalone filename from the FileCon's **FilePattern**, primarily for inbound transports that do not supply a remote/source name.

**Getter implementation**

The getter processes FilePattern through the native action/system tag helper. It then removes every literal `?`. If any `*` exists, it creates one GUID string and replaces all asterisks with that same GUID.

This differs from [`FileSavePath`](FileSavePath.md), which uses configured FileName, counters/data tags, safe-filename policy, directory combination and optional uniqueness.

**Performance and concurrency**

Processing is in-memory plus GUID/context lookup. Repeated reads intentionally can return different values; capture once for one operation.

**Related entries**

- [`FileSavePath`](FileSavePath.md) — full configured output-path generator.
- [`FilePattern`](FilePattern.md) and [`MatchesSearchPattern`](../Methods/MatchesSearchPattern.md) — source pattern and matching semantics.
- [`ProcessFileName`](../Methods/ProcessFileName.md) — separate name pipeline.

<small>Created 2026-07-15</small>
