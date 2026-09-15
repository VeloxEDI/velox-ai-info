---
title: "RemoveReadOnly"
description: "Returns success when a path is not read-only, or replaces all attributes with normal and verifies the result."
sidebar_position: 41
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
Function RemoveReadOnly( const FileName : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Attribute-changing operation; use only on a governed path.
  Value := RemoveReadOnly('C:\Fictional\Inbound\order.xml');
end;
```

### Usage

`RemoveReadOnly` returns success when a path is not read-only, or replaces all attributes with normal and verifies the result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | Path passed both to wildcard-capable `FileIsReadOnly` and, when needed, literally to `SetFileAttributesW`. |

**Returns**

`True` when the first query returns false, or when the verification query returns false after the API call; `False` only when read-only is seen both before and after.

**Behaviour**

- A file already reported writable returns `True` without calling Windows.
- A read-only file is reset to normal and queried again.
- The Boolean result of `SetFileAttributesW` and its last-error detail are discarded.
- No content is opened or changed.

**Errors**

Ordinary query and attribute-setting errors are not raised or exposed. Unexpected runtime failures can propagate.

**Usage notes**

Use a literal verified path. If preserving hidden/archive/system or other flags matters, this helper is unsuitable; use an operation that reads the current bit set and clears only read-only with checked error handling.

### Additional Technical Info
`RemoveReadOnly` returns `True` immediately when [`FileIsReadOnly`](FileIsReadOnly.md) returns false. If that query finds a read-only entry, Velox calls Windows `SetFileAttributesW(FileName, FILE_ATTRIBUTE_NORMAL)`, ignores the API return value, and reports whether a second query no longer sees read-only.

The example is fictional, source-reviewed and was not executed by the documentation workflow. A real call changes file-system attributes.

**Implementation**

The function does not read and preserve the existing attribute bit set. `FILE_ATTRIBUTE_NORMAL` is value `$80` and is valid only by itself, so a successful call replaces supported attributes with “normal” rather than clearing only `FILE_ATTRIBUTE_READONLY`.

**Edge cases and quirks**

- A missing, inaccessible or search-error path normally returns `True`, because `FileIsReadOnly` collapses those states to false.
- A successful reset can also remove hidden, system, archive, temporary or other attributes that Windows permits this API to change.
- Wildcards are unsafe here: the first query can match an entry, while `SetFileAttributesW` receives the literal wildcard text and normally fails; a later first match can also differ.
- Directory entries can match the initial search. Reset support and consequences then follow Windows directory-attribute rules.
- The verification is another racy snapshot and does not prove later write permission or successful content access.

**Side effects**

Can replace the target's supported Windows attribute set with `FILE_ATTRIBUTE_NORMAL`.

**Performance and concurrency**

One search when no read-only match is seen; otherwise two searches plus an attribute update. Remote storage can block, and concurrent attribute/path changes can invalidate the conclusion.

**Related entries**

- [`FileIsReadOnly`](FileIsReadOnly.md) defines the wildcard and false-on-query-error behavior inherited here.
- [`vxDeleteFile`](vxDeleteFile.md) requires read-only to be removed before Windows can delete a read-only file.
- [`FileLocked`](FileLocked.md) tests one access/share mode, not attributes.

**External references**

- [Microsoft `SetFileAttributesW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-setfileattributesw) - exact operating-system terminal.
- [Microsoft file attribute constants](https://learn.microsoft.com/en-us/windows/win32/fileio/file-attribute-constants) - defines `FILE_ATTRIBUTE_NORMAL` and its standalone requirement.
- [Free Pascal `FileSetAttr`](https://www.freepascal.org/docs-html/rtl/sysutils/filesetattr.html) - compatible attribute-setting context only; Velox calls Win32 directly and discards its result.

No applicable same-symbol Embarcadero core routine is called by this Velox wrapper.

<small>Created 2026-07-15</small>
