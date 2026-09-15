---
title: "ChangeFileExt"
description: "Replaces or appends the extension portion of a file-name string without changing a file."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - extension
---

```Delphi
Function ChangeFileExt( const FileName, Extension : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ChangeFileExt('C:\Fictional\orders.pending', '.csv');
  // C:\Fictional\orders.csv
end;
```

### Usage

`ChangeFileExt` replaces or appends the extension portion of a file-name string without changing a file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | File-name or path text to transform. The path does not need to exist. |
| `Extension` | `string`, `const` | Replacement extension. Include the leading dot when a conventional extension is required; use an empty string to remove the final extension. |

**Returns**

The transformed string. The input string itself is not modified.

**Behaviour**

- `'report.txt'` with `'.csv'` becomes `'report.csv'`.
- `'report'` with `'.csv'` becomes `'report.csv'`.
- `'archive.tar.gz'` with `'.zip'` becomes `'archive.tar.zip'`; only the final extension is replaced.
- `'report.txt'` with `''` becomes `'report'`.
- `Extension` is copied exactly. The routine does not add a missing dot or reject slashes, spaces or multiple dots.

**Errors**

There is no normal content-dependent exception path. Failure to convert an argument to `string` or a memory-allocation failure can occur before or during the call.

**Usage notes**

Use this function to construct a related name. Use a file move/rename operation when the actual file must change name. Do not pass a bare value such as `'csv'` unless the intended result is `'reportcsv'`.

### Additional Technical Info
`ChangeFileExt` returns a new file-name string in which the final extension is replaced by `Extension`. If no dot occurs after the final recognised path or drive delimiter, the extension is appended. It changes only text: it does not rename, create, open or inspect a file.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox registers `ChangeFileExt` through `uPSI_SysUtilsImport`, whose wrapper calls the installed `System.SysUtils.ChangeFileExt` overload directly. The current Windows implementation finds the last occurrence of a dot, the platform `PathDelim` (`\`) or the drive delimiter (`:`). It replaces the suffix only when that last delimiter is a dot; otherwise it appends `Extension`.

**Edge cases and quirks**

- A leading dot is treated as an extension delimiter. `ChangeFileExt('.env', '.txt')` returns `'.txt'`, not `'.env.txt'`.
- A trailing dot is an extension and is replaced or removed.
- On the current Windows build, the lexical delimiter set uses backslash and colon. A forward slash is not treated as a path boundary, so dots before or after `/` can produce results that differ from URL-style expectations.
- A dot in a directory segment is ignored only when a recognised path delimiter follows it.
- The result is not normalised, validated, made absolute or checked against the file system.

**Side effects**

None.

**Performance and concurrency**

The implementation scans backward for the final delimiter and allocates the result, so work is linear in the path length. It has no mutable shared state and is safe to use concurrently.

**Related entries**

- [`ExtractFileExt`](ExtractFileExt.md) returns the current final extension.
- [`ExtractFileName`](ExtractFileName.md) removes the drive and directory portion.
- [`ExtractFilePath`](ExtractFilePath.md) returns the drive and path portion.
- [`vxMoveFile`](vxMoveFile.md) performs a real file-system move.

**External references**

- [Embarcadero `System.SysUtils.ChangeFileExt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ChangeFileExt)
- [Free Pascal `ChangeFileExt`](https://www.freepascal.org/docs-html/rtl/sysutils/changefileext.html) - compatible API context; the installed Delphi source defines Velox's exact delimiter behaviour.

<small>Created 2026-07-15</small>
