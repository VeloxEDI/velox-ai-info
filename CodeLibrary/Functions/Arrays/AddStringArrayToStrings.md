---
title: "AddStringArrayToStrings"
description: "Appends every element of a string array to a target `TStringList` in order."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - arrays
  - stringlist
  - append
---

```Delphi
Procedure AddStringArrayToStrings( aStrings : TStringList; aArray : TStringArray)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Items: TStringArray;
  Lines: TStringList;
begin
  SetArrayLength(Items, 2);
  Items[0] := 'Alpha';
  Items[1] := 'Beta';

  Lines := TStringList.Create;
  try
    Lines.Add('Existing');
    AddStringArrayToStrings(Lines, Items);
    Value := Lines.Count; // 3
  finally
    Lines.Free;
  end;
end;
```

### Usage

`AddStringArrayToStrings` appends every element of a string array to a target `TStringList` in order.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aStrings` | `TStringList` | Existing target list to mutate. The caller retains ownership and must supply a live object. |
| `aArray` | `TStringArray` | Source dynamic array. Its elements are read from the lowest index to the highest index and the array is not changed. |

**Behaviour**

Existing target entries remain first, followed by every source element in order. Empty strings and duplicates are retained. An empty dynamic array appends nothing, although the list still enters and leaves its update period.

**Errors**

An exception from `BeginUpdate` propagates immediately. Once the `try` block is active, exceptions from list growth or `Add` trigger the `EndUpdate` attempt before they propagate; an `EndUpdate` exception also propagates and can supersede an earlier exception. The procedure does not log, translate or deliberately swallow failures.

### Additional Technical Info
`AddStringArrayToStrings` appends the elements of a `TStringArray` to an existing `TStringList`. It preserves array order and does not clear or replace strings already in the target list.

**Implementation**

Velox registers the helper directly in its common scripting import. The terminal implementation calls `BeginUpdate` on `aStrings`. If that call succeeds, it enters a protected block, loops from `Low(aArray)` through `High(aArray)`, calls `aStrings.Add` for every element, and attempts a matching `EndUpdate` in a `finally` block.

**Side effects**

The target list is mutated. `BeginUpdate` and `EndUpdate` batch normal change notifications while the append loop runs; they do not make the operation atomic. The source array is not modified.

**Edge cases and quirks**

- The procedure requires `TStringList`, rather than the more general `TStrings` accepted by `StringsToArray`.
- It always appends. Clear the target explicitly first if replacement is intended.
- A `nil` or invalid target reference fails when `BeginUpdate` is called.
- If an `Add` operation fails part way through, elements already appended remain in the list. The active `finally` block still calls `EndUpdate`; there is no rollback.
- `BeginUpdate` runs before the `try` block. If it raises, `EndUpdate` is not called. If `EndUpdate` itself raises while another exception is active, normal Delphi exception rules can replace the earlier exception.
- The strings are assigned through Delphi's managed string semantics. The procedure does not clone external resources or attach objects to the new list entries.

**Performance and concurrency**

The loop is linear in the number of source elements and can allocate as the target list grows. Neither the list nor the operation is locked; callers must prevent concurrent mutation of the same collection.

**Remarks**

The caller remains responsible for the target list's lifetime. Velox uses this helper internally where a persisted string-array value must be appended to an in-memory list, which confirms its append rather than replace semantics.

**Related entries**

- [`StringsToArray`](StringsToArray.md) — copies values in the opposite direction into a new array.
- [`SetArrayLength`](SetArrayLength.md) — creates or resizes the source dynamic array.

**External references**

- [Free Pascal: `TStrings.BeginUpdate`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.beginupdate.html)
- [Free Pascal: `TStrings.Add`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.add.html)
- [Embarcadero DocWiki: `TStrings.BeginUpdate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.BeginUpdate)
- [Embarcadero DocWiki: `TStrings.Add`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Add)

<small>Created 2026-07-15</small>
