---
title: "vxFileSize"
description: "Returns the 64-bit size of the first entry matching a path or wildcard mask, or zero when none is found."
sidebar_position: 53
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - size
  - wildcard
---

```Delphi
Function vxFileSize( const FileName : String) : Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := vxFileSize('C:\Fictional\Inbound\order.xml');
end;
```

### Usage

`vxFileSize` returns the 64-bit size of the first entry matching a path or wildcard mask, or zero when none is found.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `String`, `const` | Literal path or wildcard search mask. |

**Returns**

The first matching entry's size in bytes as a signed 64-bit integer, or `0` for no match/search failure. A real empty file also returns `0`.

**Behaviour**

- A literal ordinary file returns its enumerated logical byte length.
- Files larger than 4 GiB use both 32-bit fields.
- Wildcards are accepted and only the first enumerated entry is measured.
- Directory entries can match because `faAnyFile` is used; their size metadata is not a recursive directory total.

**Important usage notes**

- Zero conflates an empty file, no match, invalid path, inaccessible directory and other ordinary search failure.
- A wildcard result is not a sum and enumeration order is not a stable selection contract.
- The returned logical length is not allocated-on-disk size, compressed size, alternate-stream total or a guarantee that the content remains unchanged.
- Relative paths depend on the Velox process current directory.
- Link/reparse behavior follows Windows enumeration and is not selectable.

**Usage notes**

Use a literal path for one file. Pair zero with a separate existence/error-aware operation when empty-versus-missing matters, while still handling changes at actual use time.

### Additional Technical Info
`vxFileSize` runs Delphi `FindFirst(FileName, faAnyFile)`, combines the first match's high and low Windows size fields into an `Int64`, and returns zero when no first match is obtained.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

On successful `FindFirst`, Velox computes `(Int64(nFileSizeHigh) shl 32) + Int64(nFileSizeLow)` from the `WIN32_FIND_DATA` inside `TSearchRec`. It calls `FindClose` after either branch.

**Side effects**

No persistent change; opens/closes a directory search handle when applicable.

**Errors**

Normal `FindFirst` errors become zero. Unexpected runtime/allocation failures can propagate.

**Performance and concurrency**

One metadata enumeration, not a content read. Remote paths can block. The size is a racy snapshot and can differ by the time a file is opened.

**Related entries**

- [`FileExists`](FileExists.md) provides a separate non-directory existence snapshot.
- [`FileIsReadOnly`](FileIsReadOnly.md) uses the same first-match search pattern for attributes.
- [`LoadFileToBytes`](LoadFileToBytes.md) reads content and has different memory/error effects.

**External references**

- [Embarcadero `System.SysUtils.FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst)
- [Embarcadero `System.SysUtils.FindClose`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindClose)
- [Free Pascal `FindFirst`](https://www.freepascal.org/docs-html/rtl/sysutils/findfirst.html) - compatible first-match/search-record context; current size fields and behavior follow installed Delphi on Windows.

<small>Created 2026-07-15</small>
