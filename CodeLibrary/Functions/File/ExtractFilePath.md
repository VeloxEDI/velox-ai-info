---
title: "ExtractFilePath"
description: "Returns the drive and directory portion of a file-name string including its final delimiter."
sidebar_position: 13
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
Function ExtractFilePath( const FileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractFilePath('C:\Fictional\Inbound\order.csv');
  // C:\Fictional\Inbound\
end;
```

### Usage

`ExtractFilePath` returns the drive and directory portion of a file-name string including its final delimiter.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | File-name or path text to parse. |

**Returns**

The prefix through the final backslash or drive colon on the current Windows build, or an empty string when neither occurs.

**Behaviour**

- `'C:\Folder\report.csv'` returns `'C:\Folder\'`.
- `'C:\report.csv'` returns `'C:\'`.
- `'C:report.csv'` returns `'C:'`; this is drive-relative syntax, not a rooted directory.
- `'report.csv'` returns `''`.
- A path already ending in a backslash is returned in full.

**Errors**

There is no normal path-content exception. Argument conversion and allocation failures can propagate.

**Usage notes**

This return form is convenient for lexical concatenation because it retains the final delimiter. Prefer [`IncludeTrailingPathDelimiter`](IncludeTrailingPathDelimiter.md) when starting from directory text whose delimiter state is unknown.

### Additional Technical Info
`ExtractFilePath` returns the drive and directory prefix through the final recognised path or drive delimiter. Unlike [`ExtractFileDir`](ExtractFileDir.md), an ordinary trailing delimiter is retained.

The example is source-reviewed and was not executed by the documentation workflow. Parsing is lexical and does not require a real path.

**Implementation**

Velox's wrapper calls installed `System.SysUtils.ExtractFilePath`. The terminal routine finds the last platform path delimiter or drive delimiter and copies the string up to and including it.

**Edge cases and quirks**

- On the Windows build, a forward slash is not recognised as `PathDelim`. Mixed/URL-style paths can return an unexpected prefix or an empty string.
- The function does not guarantee that a non-empty result is absolute. Drive-relative and relative-directory text remains relative.
- It performs no separator collapse, `.`/`..` resolution, environment expansion or existence check.
- UNC and device prefixes are preserved only lexically.
- Concatenating an unvalidated suffix can still escape the intended location through `..` or rooted input. Enforce an approved path policy separately.

**Side effects**

None.

**Performance and concurrency**

The implementation scans backward and copies a prefix, so work is linear in path length. It has no mutable shared state.

**Related entries**

- [`ExtractFileDir`](ExtractFileDir.md) normally removes the final delimiter.
- [`ExtractFileName`](ExtractFileName.md) returns the complementary suffix.
- [`ExtractFileDrive`](ExtractFileDrive.md) returns only the leading drive or UNC share.
- [`IncludeTrailingPathDelimiter`](IncludeTrailingPathDelimiter.md) ensures a directory string ends in the platform delimiter.

**External references**

- [Embarcadero `System.SysUtils.ExtractFilePath`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFilePath)
- [Free Pascal `ExtractFilePath`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilepath.html) - compatible API context; installed Delphi source defines Velox's exact Windows delimiters.

<small>Created 2026-07-15</small>
