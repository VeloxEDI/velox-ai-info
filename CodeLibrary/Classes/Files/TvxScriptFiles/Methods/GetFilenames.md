---
title: GetFilenames
description: Clears a supplied string list and fills it with the base names from the current and remaining entries while exhausting the shared search cursor.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, files, filenames, strings, cursor]
---

```Delphi
procedure GetFilenames(const aList: TStrings)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Files.Search('C:\VeloxExamples\Inbound', '*.csv', 0);
  try
    Files.GetFilenames(List);
    Value := List.Text;
  finally
    Files.Close;
  end;
end;
```

### Usage

`GetFilenames` clears a supplied string list and fills it with the base names from the current and remaining entries while exhausting the shared search cursor.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aList` | `TStrings` | Existing caller/Velox-provided list to clear and populate. It must be assigned and writable. The method does not take ownership. |

The host-provided [`List`](../../../../Variables/Helpers/List.md) object is a convenient target. It is shared mutable helper state, so copy `List.Text` or required items before later list operations replace them.

**Behaviour**

The list contains the current entry followed by whatever subsequent entries the filesystem returns. If the cursor was already advanced, earlier entries are absent. If there is no current entry, the method still clears the list and leaves it empty.

Results are not necessarily files. A search that includes directories can add directory names because this method applies no `faDirectory` filter. Hidden/system entries likewise depend on the `Search` attribute mask.

After normal completion, `Exists` is false. The method neither restarts the search nor calls [`Close`](Close.md), so a successful enumeration handle remains open.

**Errors**

Errors while clearing or adding to the supplied list are raised to the script. Directory-enumeration failures are not raised. Always call `Close` in a `finally` block so the search is released even after an error.

### Additional Technical Info
`GetFilenames` replaces a supplied string list with the names from the helper's current entry through the end of its active search.

**Implementation**

The method calls `aList.Clear` unconditionally. While `Exists` is true, it adds the current [`FileName`](../Properties/FileName.md) and calls [`Next`](Next.md). It uses only the base name stored in `TSearchRec`; it does not combine the original path, sort, deduplicate or inspect file contents.

**Edge cases and quirks**

- This is a destructive cursor consumer, not a snapshot independent of the helper.
- It returns base names only. With a filename-only mask, join them to the validated stored search path if full paths are required.
- A search that includes directories can add `.` and `..` when the filesystem returns those entries; this method does not filter them.
- A mask containing a directory component can enumerate beneath `aPath` while still returning only base names, so blindly joining them to `aPath` reconstructs the wrong path.
- The Windows enumeration order is unspecified.
- A `nil` list causes an object-reference/access failure at `Clear`.
- If `Clear` or `Add` raises, the list can be empty or partially populated and the search remains at the current failing point with its handle open.
- Errors/end from `Next` both stop the loop silently.

**Side effects**

The supplied list is cleared and repopulated. The shared file cursor is consumed. No file is modified.

**Performance and concurrency**

The operation performs one `Add` and one native enumeration step per remaining entry, with memory proportional to the accumulated names. Neither the helper nor the list is synchronized; do not share them with concurrent/asynchronous script work.

**Related entries**

- [`Count`](../Properties/Count.md) consumes the same remaining range but then restarts the stored search.
- [`Search`](Search.md) controls which names can be included.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.TSearchRec`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TSearchRec)
- [Embarcadero DocWiki: `System.SysUtils.FindNext`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FindNext)
- [Free Pascal: `TSearchRec`](https://www.freepascal.org/docs-html/rtl/sysutils/tsearchrec.html)
- [Free Pascal: `FindNext`](https://www.freepascal.org/docs-html/rtl/sysutils/findnext.html)

<small>Created 2026-07-15</small>
