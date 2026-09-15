---
title: "StringsToArray"
description: "Copies the current string values from a `TStrings` collection into a new `TStringArray`."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - arrays
  - tstrings
  - snapshot
---

```Delphi
Function StringsToArray( const aStrings : TStrings) : TStringArray
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Lines: TStringList;
  Items: TStringArray;
begin
  Lines := TStringList.Create;
  try
    Lines.Add('Alpha');
    Lines.Add('Beta');
    Items := StringsToArray(Lines);
    Value := Items[1]; // Beta
  finally
    Lines.Free;
  end;
end;
```

### Usage

`StringsToArray` copies the current string values from a `TStrings` collection into a new `TStringArray`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aStrings` | `TStrings`, `const` | Live source collection to read. The function does not take ownership or deliberately mutate it. |

**Returns**

A newly allocated `TStringArray` with one element for each source entry. An empty collection returns a zero-length array. Only string values are returned; any objects associated with the source entries are omitted.

**Behaviour**

Element order, duplicate strings and empty strings are preserved. The result's array storage is independent of the collection. Velox strings use managed reference semantics, so the initial assignments share managed string data safely and later string changes follow normal copy-on-write behaviour.

**Errors**

Exceptions from source access, string retrieval or memory allocation propagate to the calling script. The function does not catch, log or translate them.

### Additional Technical Info
`StringsToArray` takes a value-only snapshot of a `TStrings` collection and returns those strings in a new `TStringArray`, preserving their current order.

**Implementation**

Velox registers the helper directly through its common scripting import. The terminal implementation allocates the result using the source `Count`, then loops from index zero through `Count - 1` and assigns each default `Strings[index]` value to the matching result element.

**Side effects**

The function allocates a new array and managed string references. It does not clear, reorder or take ownership of the source collection, and does not copy its associated `Objects` values.

**Edge cases and quirks**

- A `nil` or invalid collection reference fails when the implementation reads `Count`.
- The implementation reads `Count` for allocation and again to establish the loop bound. Concurrent mutation between those reads can create a mismatched bound; `TStrings` access is not synchronised here.
- The parameter type is `TStrings`, so a `TStringList` or another compatible descendant can be supplied.
- The snapshot represents the source at the points each item is read. Do not mutate the collection concurrently and expect an atomic view.

**Performance and concurrency**

Time and result storage are linear in the source count. No locking is added; callers must serialise access if another thread or callback can modify the same collection.

**Remarks**

The caller owns the returned dynamic-array value under normal managed-array semantics. Free the source object according to its existing ownership rules; returning the array does not extend the source collection's lifetime.

**Related entries**

- [`AddStringArrayToStrings`](AddStringArrayToStrings.md) — appends array values to an existing `TStringList`.
- [`GetArrayLength`](GetArrayLength.md) — returns the number of elements in the resulting array.

**External references**

- [Free Pascal: `TStrings.Count`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.count.html)
- [Free Pascal: `TStrings.Strings`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.strings.html)
- [Embarcadero DocWiki: `TStrings.Count`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Count)
- [Embarcadero DocWiki: `TStrings.Strings`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Strings)

<small>Created 2026-07-15</small>
