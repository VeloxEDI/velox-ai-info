---
title: "ExtractFileDrive"
description: "Returns the drive or UNC share prefix parsed from a file-name string."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - drive
  - unc
---

```Delphi
Function ExtractFileDrive( const FileName : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractFileDrive('\\fictional-server\inbound\order.csv');
  // \\fictional-server\inbound
end;
```

### Usage

`ExtractFileDrive` returns the drive or UNC share prefix parsed from a file-name string.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | Path text whose leading drive or UNC prefix is required. |

**Returns**

For a drive-letter path, the two-character prefix such as `'C:'`; for a UNC path, the server/share prefix such as `'\\server\share'`; otherwise an empty string.

**Behaviour**

- Both `'C:\Folder\file.txt'` and `'C:file.txt'` return `'C:'`; the result alone does not distinguish rooted from drive-relative input.
- `'\\server\share\folder\file.txt'` returns `'\\server\share'`.
- A relative path such as `'folder\file.txt'` returns `''`.
- Letter case and original prefix spelling are preserved.

**Errors**

No normal content-dependent exception is raised. Argument conversion and allocation failures can propagate.

**Usage notes**

Do not use a non-empty result as proof that storage is available. Combine it with an approved absolute-path policy and the appropriate existence or access operation.

### Additional Technical Info
`ExtractFileDrive` parses and returns the drive designator or UNC share prefix at the start of `FileName`. It is a string parser: it does not query drives, servers or shares.

The example uses a fictional UNC path. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox wrapper delegates to installed `System.SysUtils.ExtractFileDrive`. The current Windows helper recognises a colon in the second character, a conventional `\\server\share` prefix, and extended/device forms beginning `\\?\` or `\\.\`. It calculates the recognised prefix length and copies that prefix unchanged.

**Edge cases and quirks**

- The function recognises syntax, not validity. A returned drive/share can be absent, inaccessible or incomplete for the intended operation.
- Extended-length and device prefixes have specialised scanning rules. Preserve the original full path when later APIs must retain those semantics.
- A colon outside the drive position is not a drive designator.
- On the Windows build, backslashes define UNC structure; mixed or forward-slash paths are not normalised first.
- Empty and malformed/incomplete UNC text can return an empty or partial lexical result; it does not raise a validation error.

**Side effects**

None.

**Performance and concurrency**

Parsing is linear only across the short leading prefix and then allocates the result. It has no mutable shared state.

**Related entries**

- [`ExtractFileDir`](ExtractFileDir.md) returns the drive plus directory.
- [`ExtractFilePath`](ExtractFilePath.md) returns the prefix through the final delimiter.
- [`ProcessPath`](ProcessPath.md) exposes a legacy VCL split into drive, directory and file outputs.

**External references**

- [Embarcadero `System.SysUtils.ExtractFileDrive`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileDrive)
- [Free Pascal `ExtractFileDrive`](https://www.freepascal.org/docs-html/rtl/sysutils/extractfiledrive.html) - compatible API context; extended Windows-prefix details come from installed Delphi source.

<small>Created 2026-07-15</small>
