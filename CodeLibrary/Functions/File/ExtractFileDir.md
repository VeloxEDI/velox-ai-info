---
title: "ExtractFileDir"
description: "Returns the drive and directory portion of a file-name string without its trailing separator in ordinary cases."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - directory
---

```Delphi
Function ExtractFileDir( const FileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractFileDir('C:\Fictional\Inbound\order.csv');
  // C:\Fictional\Inbound
end;
```

### Usage

`ExtractFileDir` returns the drive and directory portion of a file-name string without its trailing separator in ordinary cases.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | File-name or path text to parse. It may be absolute, drive-relative or relative. |

**Returns**

The parsed drive/directory text, or an empty string when no recognised path or drive delimiter occurs.

**Behaviour**

- `'C:\Folder\file.txt'` returns `'C:\Folder'`.
- `'C:\file.txt'` returns `'C:\'`, preserving the drive root.
- `'C:file.txt'` returns `'C:'`; that remains a drive-relative prefix, not a drive-root path.
- `'file.txt'` returns `''`.
- The result is computed from text even when no such directory exists.

**Errors**

There is no normal path-content exception. String conversion or allocation failures can propagate.

**Usage notes**

Use this result when an API expects a directory name without an ordinary trailing separator. Use `ExtractFilePath` when the result will be concatenated directly with another relative name.

### Additional Technical Info
`ExtractFileDir` returns the drive and directory portion parsed from `FileName`. Unlike [`ExtractFilePath`](ExtractFilePath.md), it normally omits the trailing path delimiter so the result can be used as a directory name.

The example is source-reviewed and was not executed by the documentation workflow. No path existence check occurs.

**Implementation**

The Velox wrapper calls installed `System.SysUtils.ExtractFileDir`. On Windows the RTL locates the final backslash or drive colon. When the final delimiter is a backslash whose preceding character is neither a backslash nor a colon, it steps back one character before copying the prefix. That rule removes an ordinary trailing separator while retaining drive-root and paired-separator forms.

**Edge cases and quirks**

- This is not the same operation as removing the final delimiter from [`ExtractFilePath`](ExtractFilePath.md) for every root/UNC case; the installed implementation has explicit preceding-character rules.
- A path ending in an ordinary directory separator is treated as directory text and normally returned without that final separator.
- On Windows, forward slashes are not part of the terminal delimiter set. URL-style or mixed-separator input can parse unexpectedly.
- `.` and `..` segments, duplicate separators, environment variables and relative prefixes are not resolved.
- UNC, extended-length and device prefixes are preserved lexically; the routine does not verify that the share or device exists.

**Side effects**

None.

**Performance and concurrency**

The routine scans backward and copies a prefix, making work linear in the path length. It has no mutable shared state.

**Related entries**

- [`ExtractFilePath`](ExtractFilePath.md) retains the final delimiter.
- [`ExtractFileDrive`](ExtractFileDrive.md) returns only the drive or UNC-share prefix.
- [`ExtractFileName`](ExtractFileName.md) returns the complementary name-and-extension suffix.
- [`IncludeTrailingPathDelimiter`](IncludeTrailingPathDelimiter.md) can prepare the result for safe lexical concatenation.

**External references**

- [Embarcadero `System.SysUtils.ExtractFileDir`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileDir)
- [Free Pascal `ExtractFileDir`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfiledir.html) - compatible path-parsing context; installed Delphi source defines Velox's exact root handling.

<small>Created 2026-07-15</small>
