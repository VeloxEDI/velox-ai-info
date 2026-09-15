---
title: Search
description: Replaces the shared search cursor with the first Windows directory entry matching a path, wildcard mask and Delphi attribute-inclusion value.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, search, wildcard, attributes]
---

```Delphi
procedure Search(const aPath, aSearchMask: String; const aSearchAttr: Integer)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Attribute 0 includes ordinary entries but excludes hidden, system and directory entries. }
  Files.Search('C:\VeloxExamples\Inbound', '*.csv', 0);
  try
    if Files.Exists then
      Value := Files.FileName
    else
      Value := '';
  finally
    Files.Close;
  end;
end;
```

### Usage

Replaces the shared search cursor with the first Windows directory entry matching a path, wildcard mask and Velox attribute-inclusion value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aPath` | `String` | Directory portion. Velox appends a Windows path delimiter if needed. Relative values use the Velox host process's current directory. |
| `aSearchMask` | `String` | Intended filename component, passed verbatim to Windows and normally using `*` and/or `?` wildcards. This is not a regular expression. Velox does not reject directory separators. |
| `aSearchAttr` | `Integer` | Velox special-attribute inclusion mask. It includes requested hidden/system/directory entries in addition to ordinary entries; it is not a set of attributes that every result must possess. |

Common useful values for Velox on Windows are `0` (exclude hidden, system and directory entries), `$2` (also include hidden), `$4` (also include system), `$10` (also include directories), and `$1FF`/`511` (`faAnyFile`). Combine required bits with `or`. Read [`FileAttr`](../Properties/FileAttr.md) to test the attributes actually returned.

**Behaviour**

On success, `FileName`, `FileSize`, `FileAttr` and `FileTimeStamp` describe the first entry returned by the filesystem. Use [`Next`](Next.md) to advance. Windows does not sort results, so never rely on alphabetic or creation order.

The search is by name. It does not recurse, open the file, verify that it will remain present, or lock it against changes. Windows can match long and short names. Files may be created, removed or replaced while the handle is open.

### Additional Technical Info
`Search` starts a new non-recursive directory enumeration and positions the shared helper on its first matching entry.

**Implementation**

The method first calls [`Close`](Close.md), then stores all three input values. It builds the native pattern as:

```Delphi
IncludeTrailingPathDelimiter(aPath) + aSearchMask
```

It passes that pattern, the integer mask and the object's `TSearchRec` to Delphi `FindFirst`. A zero result sets `Exists` true and marks the search handle as needing closure; every nonzero result sets both states false. Delphi delegates the Windows search to `FindFirstFileW` and filters out hidden, system and directory entries whose inclusion bits were not supplied.

**Edge cases and quirks**

- `IncludeTrailingPathDelimiter('')` returns `\` on Windows. An empty `aPath` therefore searches from the current drive's root, not the process current directory.
- An empty mask produces a pattern ending in a backslash, which Windows rejects; this appears only as `Exists = False`.
- Passing `faDirectory` does not restrict results to directories. Ordinary entries are still included, so test the returned attribute bit yourself.
- Relative paths, drive-relative paths, UNC paths, `..` segments and long-path prefixes are neither canonicalised nor confined by Velox.
- A mask containing a relative directory component can cause Windows to enumerate that nested directory. The returned `FileName` is still only the base name; keep masks filename-only unless the script separately preserves and validates the effective directory.
- The class exposes no error code. “No match”, access denied, invalid path, unsupported path length and other `FindFirst` failures are indistinguishable through this API.

**Side effects**

Any previous enumeration is closed. The helper's stored query, search record, current-entry flag and handle-lifetime flag are replaced. Filesystem contents are not changed.

**Errors**

Native enumeration errors are swallowed into `Exists = False`. String allocation or an invalid/freed helper object can still raise normally. Path permissions are evaluated under the Windows identity running Velox Designer, Velox Service or Velox API Service.

**Performance and concurrency**

The call opens one synchronous OS enumeration and obtains only the first result. It is not synchronized and cannot safely overlap another operation on the same helper. Treat the metadata as a point-in-time observation rather than an authoritative snapshot.

**Related entries**

- [`Exists`](../Properties/Exists.md) reports whether this search currently has an entry.
- [`Count`](../Properties/Count.md) consumes the remainder and reruns this stored search.
- [`Close`](Close.md) releases a successful enumeration.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst)
- [Embarcadero DocWiki: `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter)
- [Embarcadero DocWiki: `System.SysUtils.TSearchRec`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TSearchRec)
- [Free Pascal: `FindFirst`](https://www.freepascal.org/docs-html/rtl/sysutils/findfirst.html)
- [Free Pascal: `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html)
- [Microsoft Learn: `FindFirstFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findfirstfilew)

<small>Created 2026-07-15</small>
