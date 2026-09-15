---
title: TempDir
description: Stores the raw temporary-directory template, which any FileDir assignment replaces with the primary directory's TEMP child.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, temporary-directory, configuration]
---

```Delphi
property TempDir: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.TempDir
  else
    Value := '';
end;
```

### Usage

`TempDir` stores the raw temporary-directory template, which any FileDir assignment replaces with the primary directory's TEMP child.

**FileDir ownership**

[`FileDir`](FileDir.md) effectively owns the default TempDir lifecycle. At the end of every FileDir setter call, Velox assigns:

```Delphi
TempDir := normalised FileDir + 'TEMP\';
```

This replacement occurs:

- even when the supplied FileDir compares equal to the current value;
- while the component is being read/loaded; and
- regardless of whether TempDir was custom.

A separate TempDir assignment survives only until the next FileDir assignment. FileCon Transfer copies the raw field directly and bypasses this derivation.

Normal configuration streaming or a later FileDir assignment usually establishes `<DefaultDir>\TEMP\`, but code should not infer a nonblank TempDir merely from the FileDir default before that lifecycle step.

**Errors, security and concurrency**

- The setter is silent and does not report an inaccessible/malformed path.
- Folder checking ignores the Boolean return from its individual ForceDirectories calls; a caller must not treat a configured value alone as proof of success.
- Relative/dynamic paths and untrusted tags can escape the intended root or disclose values.
- Temporary data confidentiality, cleanup, capacity and service permissions remain deployment responsibilities.
- FileDir/TempDir writes are unsynchronised and can race with processing.

### Additional Technical Info
`TempDir` stores FileCon's raw temporary-directory template. Reading it does not resolve `<DefaultDir>` or other tags; use [`ProcessTempDir`](../Methods/ProcessTempDir.md) for the processed string.

The direct setter applies Delphi `IncludeTrailingPathDelimiter` but does no filesystem work or validation. Empty input becomes a platform delimiter in Delphi-compatible behaviour.

**Current native use**

`ProcessTempDir` expands the default-directory token and current action/system tags. In the current native source, the directory-check operation is the direct consumer: it attempts to create the processed TempDir when missing. FileCon does not automatically create temporary files there, clean the directory, impose retention or guarantee exclusive use.

Scripts may read/write TempDir and call ProcessTempDir, but an assignment is not a reservation or ownership boundary.

**Related entries**

- [`ProcessTempDir`](../Methods/ProcessTempDir.md) — current tag-resolved template.
- [`FileDir`](FileDir.md) — unconditionally re-derives TempDir on assignment.
- [`TvxFileCon`](../../TvxFileCon.md) — configuration and per-execution state lifecycle.

**External references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — delimiter helper used by the direct setter and FileDir derivation.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatible behaviour, including empty input.

<small>Created 2026-07-15</small>
