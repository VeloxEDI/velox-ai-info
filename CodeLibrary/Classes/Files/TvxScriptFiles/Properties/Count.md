---
title: Count
description: Counts the current and remaining search entries by exhausting the cursor, then reruns the stored search and leaves it at its new first result.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, count, search, cursor]
---

```Delphi
property Count: Integer read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.csv', 0);
  try
    Value := Files.Count;
  finally
    Files.Close;
  end;
end;
```

### Usage

Counts the current and remaining search entries by exhausting the cursor, then reruns the stored search and leaves it at its new first result.

**Value**

The value is the number of entries for which `Exists` is true while advancing from the current cursor position. It is not necessarily the total number originally matched:

- immediately after `Search`, it counts the whole current enumeration;
- after one or more calls to `Next`, it counts only the current and later entries; and
- after exhaustion, `Close` or a failed search, it returns zero before attempting the restart.

Directories and special entries count if the stored search includes them.

**Behaviour**

Although syntactically a property read, `Count` materially mutates the helper. On return, the cursor normally points to the first entry of the new enumeration and `Exists` reflects that new `FindFirst`, not the exhausted sequence used for counting.

The filesystem is not snapshotted. If entries change during counting or before the restart, the returned count can describe a different set from the newly positioned cursor.

**Errors**

OS enumeration failures are hidden. Ordinary allocation/range/object-lifetime failures can propagate. There is no status telling the caller whether the count was complete.

### Additional Technical Info
`Count` is a read-only `Integer` property that counts entries from the current search position through the end, then starts the stored search again.

**Implementation**

The getter initializes the result to zero, repeatedly increments it and calls `Next` while `Exists` is true, then calls `Search` with the stored path, mask and attribute integer. That restart closes the exhausted handle and runs a fresh `FindFirst`.

**Edge cases and quirks**

- Reading `Count` after advancing undercounts the original set.
- Reading it on a new object uses initially empty stored values; the internal restart constructs a root-relative backslash with an empty mask and normally remains false.
- Enumeration errors are treated like the end and can produce a partial count. Restart errors are also reduced to `Exists = False`.
- With more than `MaxInt` remaining entries, the `Integer` increment can overflow under the host's checked arithmetic settings.
- The restart keeps a successful new handle open, so `Count` does not release resources permanently.

**Side effects**

The current enumeration is exhausted and replaced by a fresh search. No files are changed.

**Performance and concurrency**

The getter is `O(n)` in the number of remaining entries and performs an additional `FindFirst`. Do not place it repeatedly in a loop. Concurrent filesystem changes and calls on the same helper make both count and final cursor nondeterministic.

**Related entries**

- [`GetFilenames`](../Methods/GetFilenames.md) consumes the remainder without restarting.
- [`Search`](../Methods/Search.md) establishes the values used by the automatic restart.
- [`Exists`](Exists.md) exposes the new first-result state after the getter returns.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.FindFirst`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindFirst)
- [Embarcadero DocWiki: `System.SysUtils.FindNext`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindNext)
- [Free Pascal: `FindFirst`](https://www.freepascal.org/docs-html/rtl/sysutils/findfirst.html)
- [Free Pascal: `FindNext`](https://www.freepascal.org/docs-html/rtl/sysutils/findnext.html)

<small>Created 2026-07-15</small>
