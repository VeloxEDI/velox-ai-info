---
title: Close
description: Releases the helper's successful directory-search handle and marks the shared cursor as having no current entry.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, close, search, handle]
---

```Delphi
procedure Close
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.txt', 0);
  try
    Value := Files.Exists;
  finally
    Files.Close;
  end;
end;
```

### Usage

`Close` releases the helper's successful directory-search handle and marks the shared cursor as having no current entry.

**Behaviour**

After an active search is closed, all current-entry properties return their no-entry sentinel. A later `Next` is invalid usage: it attempts to advance the no-longer-active record and merely leaves `Exists` false because OS errors are collapsed.

Calling `Close` repeatedly is safe and has no additional effect. Starting a new `Search` calls `Close` first. The object's destructor also calls it, so the script execution eventually releases an abandoned handle.

**Errors**

Velox `FindClose` has no return value in this path. The function does not surface an OS close error. Exceptions are not expected for a normally initialised search record, but invalid memory/object lifetime remains ordinary unsafe script usage.

### Additional Technical Info
`Close` terminates the current successful directory-search sequence and invalidates the public current-entry state.

**Implementation**

The helper records whether its last successful `FindFirst` requires `FindClose`. When that flag is true, `Close` passes the stored `TSearchRec` to Delphi `System.SysUtils.FindClose`, clears the close-needed flag and sets `Exists := False`.

If no search has succeeded since the previous close, the method does nothing. It does not clear the stored search path, mask or attribute value; those values remain available for `Count`'s internal restart logic.

**Side effects**

The Windows enumeration handle is released, and the shared `Exists` state changes to false. No file or directory is modified.

**Performance and concurrency**

The operation is constant-time apart from the OS handle close. It has no synchronization; another call using the same helper concurrently can race with the close.

**Related entries**

- [`Search`](Search.md) creates the handle and replaces any prior search.
- [`Next`](Next.md) advances an active search but does not close it at the end.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.FindClose`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindClose)
- [Free Pascal: `FindClose`](https://www.freepascal.org/docs-html/rtl/sysutils/findclose.html)

<small>Created 2026-07-15</small>
