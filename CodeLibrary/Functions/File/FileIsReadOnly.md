---
title: "FileIsReadOnly"
description: "Reports the read-only attribute of the first file-system entry matching a path or wildcard mask."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - read-only
  - attributes
---

```Delphi
Function FileIsReadOnly( const FileName : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := FileIsReadOnly('C:\Fictional\Inbound\order.xml');
end;
```

### Usage

`FileIsReadOnly` reports the read-only attribute of the first file-system entry matching a path or wildcard mask.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | Literal path or wildcard search mask. Relative input uses the process current directory. |

**Returns**

`True` only when `FindFirst` succeeds and the first result contains `faReadOnly`; otherwise `False`.

**Behaviour**

- A literal existing read-only file returns `True`.
- A literal writable file returns `False`.
- Wildcards are accepted and only the first returned match is inspected.
- Directories can match because `faAnyFile` includes directory entries.

**Errors**

Normal `FindFirst` errors are returned as `False`; unexpected runtime/allocation failures can propagate.

**Usage notes**

Use a literal path when testing one entry. Do not use `False` as proof that a file exists or is writable; make those checks separately and handle failure at the actual write.

### Additional Technical Info
`FileIsReadOnly` searches `FileName` with Delphi `FindFirst(..., faAnyFile)` and reports whether the first matching entry has the Windows read-only attribute.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The wrapper initialises `Result := False`, calls installed Delphi [`FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst) with `faAnyFile`, tests `SearchRec.Attr and faReadOnly`, and closes a successful search.

**Edge cases and quirks**

- Missing paths, no wildcard match, malformed input, inaccessible storage and ordinary search errors all collapse to `False`.
- With a wildcard, the result does not mean every match is read-only and enumeration order should not be treated as stable.
- The attribute is a metadata snapshot and can change immediately after return.
- Read-only is not the same as effective write permission; ACLs, sharing, directory permissions and storage policy can still prevent writes.
- Reparse/link behavior follows Windows directory enumeration and is not configurable here.

**Side effects**

No persistent change. A search handle is opened and closed on success.

**Performance and concurrency**

One directory search/metadata lookup. Remote storage can block. No locking is retained, so the result is inherently racy.

**Related entries**

- [`RemoveReadOnly`](RemoveReadOnly.md) uses this ambiguous query before changing attributes.
- [`FileLocked`](FileLocked.md) tests a particular read/write open mode rather than an attribute.
- [`FileExists`](FileExists.md) distinguishes files from directories but still returns a snapshot.

**External references**

- [Embarcadero `System.SysUtils.FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst)
- [Embarcadero `System.SysUtils.FindClose`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindClose)
- [Free Pascal `FindFirst`](https://www.freepascal.org/docs-html/rtl/sysutils/findfirst.html) and [Free Pascal `FindClose`](https://www.freepascal.org/docs-html/rtl/sysutils/findclose.html) - compatible search context; Windows/installed Delphi define current attributes and enumeration.

<small>Created 2026-07-15</small>
