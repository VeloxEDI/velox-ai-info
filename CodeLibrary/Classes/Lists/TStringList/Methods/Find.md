---
title: Find
description: Binary-searches a genuinely sorted list and returns either a matching position or the comparator insertion position.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, string-list, find, binary-search, insertion-index]
---

```Delphi
function Find(S: string; var Index: Integer): Boolean;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Names: TStringList;
  Index: Integer;
begin
  Names := TStringList.Create;
  try
    Names.CaseSensitive := True;
    Names.Sorted := True;
    Names.Add('Alpha');
    Names.Add('Gamma');

    if Names.Find('Beta', Index) then
      Value := Names.Strings[Index]
    else
      Value := Index;  // 1: where Beta would be inserted
  finally
    Names.Free;
  end;
end;
```

### Usage

`Find` binary-searches a genuinely sorted list and returns either a matching position or the comparator insertion position.

### Additional Technical Info
`Find` performs a binary search using the list's current comparison function. It returns true when an entry compares equal to `S`. On every normal exit it writes `Index`: a matching position when found, or the position where a comparator-ordered insertion would occur when absent.

The method does not check [`Sorted`](../Properties/Sorted.md). It runs the same binary algorithm when the flag is false or when physical order has been corrupted by a guarded-but-callable inherited operation. Such a call can return false despite an existing string, true for an unexpected duplicate, or an invalid insertion assumption. Use linear inherited `IndexOf` for an unsorted list.

Comparison obeys [`CaseSensitive`](../Properties/CaseSensitive.md). Hidden `UseLocale` defaults true and cannot be changed through this importer, so the current Delphi runtime uses `AnsiCompareStr` or `AnsiCompareText` and the process/operating-system locale. The ordering is not a stable ordinal protocol collation.

When duplicates are accepted, the search continues toward the lower insertion boundary and normally returns the position before equal entries. With another duplicate policy, the implementation can stop at a matching midpoint rather than guaranteeing the first physical equal item. Do not use the result to identify a particular duplicate object.

The method does not mutate the list or fire change events. It is O(log n) comparisons and uses no extra list-sized allocation. A comparator/runtime failure propagates and may leave the `var Index` value from the caller unchanged; use it only after normal return.

The source-reviewed example establishes comparison settings and maintained sorting before calling the method. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.Find`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Find) - Delphi binary-search contract.
- [Free Pascal: `TStringList.Find`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.find.html) - compatible sorted-list and insertion-index guidance.

<small>Created 2026-07-15</small>
