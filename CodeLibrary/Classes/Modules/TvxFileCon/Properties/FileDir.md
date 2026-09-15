---
title: FileDir
description: Stores the primary raw file-directory template and drives FileCon's dependent audit, transport, issue, error, duplicate and temporary paths.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, file-directory, configuration]
---

```Delphi
property FileDir: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.FileDir  { Raw template. }
  else
    Value := '';
end;
```

### Usage

`FileDir` stores the primary raw file-directory template and drives FileCon's dependent audit, transport, issue, error, duplicate and temporary paths.

**Side effects and safety**

Setting FileDir itself performs no filesystem I/O, but its cascade mutates up to six other properties immediately. Later consumers may discover, create, copy, save or move files under the resulting processed path.

- No canonicalisation, containment check or permission check occurs.
- Relative/`..` segments and untrusted tag values can redirect filesystem effects.
- Mapped drives may not exist for a Windows service; use a service-accessible UNC/local path where appropriate.
- Dynamic tags can produce different directories at different times.
- Raw configuration can include secrets that later appear in log messages or database path snapshots.
- FileCon mutation is unsynchronised; do not change the path family concurrently with processing.

### Additional Technical Info
`FileDir` is FileCon's primary stored directory template. It supplies the base for file discovery, generated output paths, inbound copy destinations, monitoring and comparisons with finalisation directories.

A new FileCon defaults to `<DefaultDir>\`. Read access returns that raw template. [`ProcessFileDir`](../Methods/ProcessFileDir.md) replaces the default-directory token and resolves the current action/system tags.

**Setter sequence**

Every assignment ends by applying Delphi `IncludeTrailingPathDelimiter` to FileDir, then replacing TempDir with the resulting `FileDir + 'TEMP\'`. Neither step validates or creates a directory.

The other cascade runs only when all of these are true:

- the component is not being read or loaded;
- the old raw FileDir is not exactly equal to the supplied value; and
- the dependent property matches a recognised old standard form where required.

That block uses case-sensitive inequality for the FileDir change test but case-insensitive comparisons for recognised child paths. A case-only change, or supplying the same path without its existing trailing delimiter, can therefore trigger it.

| Dependent property | Result of a qualifying FileDir change |
|---|---|
| [`AuditDir`](AuditDir.md) | Relocated only for old base, `AUDIT\` or one of four exact date suffixes. |
| [`IssueDir`](IssueDir.md) | Relocated only for old base, `ISSUE\` or the same four date forms. |
| [`ErrorDir`](ErrorDir.md) | Relocated only for old base or simple `ERROR\`. |
| [`DuplicateDir`](DuplicateDir.md) | Relocated only for old base, `DUPLICATE\` or the four date forms. |
| [`TransportDir`](TransportDir.md) | Always replaced with new base plus `TRANSPORT\` inside the qualifying block, even if custom. |
| [`TempDir`](TempDir.md) | Always replaced with normalised FileDir plus `TEMP\` after the block, even during loading or a same-value assignment. |

The recognised date suffixes are `<yyyy>-<mm>`, `<yyyy>-<mm>-<dd>`, `<yyyy><mm>` and `<yyyy><mm><dd>` beneath the relevant status folder.

**Loading, copying and defaults**

- Component reading/loading suppresses the Audit/Issue/Error/Duplicate/Transport cascade, but FileDir is still normalised and TempDir is still derived at that setter call.
- FileCon `Transfer` copies all raw fields directly, bypassing FileDir's setter and all normalisation/cascades.
- `New` assigns the FileDir backing field directly and does not explicitly initialise TempDir. Normal streaming or a later FileDir assignment establishes TempDir.
- Loading configuration with a version below 300 subsequently forces IssueDir, DuplicateDir and TransportDir beneath FileDir.

These distinctions mean the same apparent values can have different histories. Do not rely on assigning FileDir as a harmless way to re-read or normalise only that one property.

**Runtime consumers**

The processed value is used by:

- `FilePath` fallback discovery as `ProcessFileDir + ProcessFilePattern`;
- `FileSavePath` as the prefix for the processed FileName;
- `CopyFileFrom` as its destination;
- service monitoring and schedule/monitor-path reporting;
- audit/error/transport routines when deciding whether source and destination strings are equal; and
- setup folder checks, which attempt to create the processed primary directory.

Adding/saving a FileCon also copies ProcessFileDir into the `MAINFILEPATH` operational column, truncated to 255 characters. This snapshot is separate from the raw published configuration and does not prove validity.

**Related entries**

- [`ProcessFileDir`](../Methods/ProcessFileDir.md) — current tag-resolved string.
- [`FilePath`](FilePath.md) — destructive discovery/current-file state.
- [`FileName`](FileName.md) and [`FileSavePath`](FileSavePath.md) — output-path construction.
- [`FilePattern`](FilePattern.md) — discovery and monitoring pattern.

**External references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — Delphi normalisation used for FileDir and derived paths.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatible path-delimiter and empty-input behaviour.

<small>Created 2026-07-15</small>
