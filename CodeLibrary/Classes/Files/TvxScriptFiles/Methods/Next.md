---
title: Next
description: Advances the shared directory cursor to the next matching entry and collapses both end-of-search and OS failure to Exists false.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, next, search, cursor]
---

```Delphi
procedure Next
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.txt', 0);
  try
    if Files.Exists then
      Files.Next;

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

Advances the shared directory cursor to the next matching entry and collapses both end-of-search and OS failure to Exists false.

**Behaviour**

Call `Next` only while [`Exists`](../Properties/Exists.md) is true after a successful [`Search`](Search.md). On success, all current-entry properties immediately refer to the newly selected entry. Copy any name, size, attribute or timestamp needed from the old entry before advancing.

When no further entry exists, `Exists` becomes false. The method does not call `FindClose`; the handle remains open until [`Close`](Close.md), another `Search`, a `Count` restart or object destruction.

**Errors**

The Velox error code is not exposed and no enumeration exception is raised by this function. Errors from later property/list code remain independent and can still raise.

### Additional Technical Info
`Next` moves the helper's one shared directory enumeration to its next matching entry.

**Implementation**

The method passes the stored `TSearchRec` directly to Delphi `System.SysUtils.FindNext`. It sets `Exists` to true only when that call returns zero; every other return sets it false. Delphi delegates to Windows `FindNextFileW` and retains the filter established by `Search`.

**Edge cases and quirks**

- End-of-enumeration and every OS error have the same public result: `Exists = False`.
- Calling `Next` before a successful `Search`, after `Close`, or again after exhaustion still calls `FindNext` with a non-active/invalid record. The invalid-handle error is hidden and `Exists` remains false.
- Enumeration order depends on the filesystem and is not guaranteed to be alphabetic.
- Concurrent file creation, deletion or replacement can change what is returned. A current entry does not reserve or lock that path.

**Side effects**

The object's search record and `Exists` flag change. No file is modified.

**Performance and concurrency**

Each call is one synchronous OS enumeration step. The shared record has no lock; concurrent or re-entrant calls can skip entries, close the wrong sequence or expose mismatched metadata.

**Related entries**

- [`Search`](Search.md) establishes the cursor and its filters.
- [`GetFilenames`](GetFilenames.md) repeatedly consumes `Next` into a list.
- [`Count`](../Properties/Count.md) repeatedly consumes `Next` and then restarts the search.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.FindNext`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindNext)
- [Free Pascal: `FindNext`](https://www.freepascal.org/docs-html/rtl/sysutils/findnext.html)
- [Microsoft Learn: `FindNextFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findnextfilew)

<small>Created 2026-07-15</small>
