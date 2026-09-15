---
title: "ExtractFileName"
description: "Returns the name and extension after the final path or drive delimiter."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - filename
---

```Delphi
Function ExtractFileName( const FileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractFileName('C:\Fictional\Inbound\order.csv');
  // order.csv
end;
```

### Usage

`ExtractFileName` returns the name and extension after the final path or drive delimiter.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | File-name or path text to parse. |

**Returns**

The name-and-extension suffix. If no recognised delimiter exists, the complete input is returned.

**Behaviour**

- `'C:\Folder\report.csv'` returns `'report.csv'`.
- `'C:report.csv'` also returns `'report.csv'`.
- `'report.csv'` is returned unchanged.
- A path ending in a recognised delimiter returns an empty string.
- Dots are not special to this routine; use [`ExtractFileExt`](ExtractFileExt.md) to separate the extension.

**Errors**

There is no normal content-dependent exception. String conversion and allocation failures can propagate.

**Usage notes**

Treat the result as untrusted when the input came from outside the configuration. Removing a directory prefix does not make a name safe for local file creation; validate it against the target path policy.

### Additional Technical Info
`ExtractFileName` returns the part of `FileName` after its final recognised path or drive delimiter. The returned value includes any extension.

The example is source-reviewed and was not executed by the documentation workflow. The path does not need to exist.

**Implementation**

The Velox wrapper calls installed `System.SysUtils.ExtractFileName`. On Windows the RTL locates the last backslash or drive colon and copies everything after it. It does not call the file system.

**Edge cases and quirks**

- On the current Windows build, forward slash is not part of the delimiter set. Mixed or URL-style input may be returned with slash-separated prefixes still attached.
- UNC and extended prefixes are handled only because their final backslash is recognised; no network syntax validation occurs.
- `.` and `..` path segments are not resolved.
- The return can contain characters that are invalid in a Windows file name because this is only lexical parsing.
- An empty input returns an empty string.

**Side effects**

None.

**Performance and concurrency**

The routine scans backward and copies the suffix. It is linear in path length and has no mutable shared state.

**Related entries**

- [`ExtractFilePath`](ExtractFilePath.md) returns the complementary prefix including its delimiter.
- [`ExtractFileDir`](ExtractFileDir.md) returns a directory-style prefix.
- [`ExtractFileExt`](ExtractFileExt.md) returns only the extension.
- [`MakeSafeFilename`](MakeSafeFilename.md) is a separate Velox-owned transformation.

**External references**

- [Embarcadero `System.SysUtils.ExtractFileName`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileName)
- [Free Pascal `ExtractFileName`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilename.html) - compatible API context; the installed Windows Delphi delimiter set defines Velox behaviour.

<small>Created 2026-07-15</small>
