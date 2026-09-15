---
title: StringList
description: "Aliases TStringList without constructing, cloning, sorting, synchronising, or changing ownership of the mutable collection."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, reference, alias, stringlist, collection, ownership]
---

```Delphi
StringList = TStringList
```

### Example

```Delphi
procedure BuildNames(var Names: StringList);
begin
  Names := TStringList.Create;
  try
    Names.Add('Alpha');
    Names.Add('Beta');
    // Consume Names while this procedure still owns it.
  finally
    Names.Free;
    Names := nil;
  end;
end;
```

### Usage

Aliases TStringList without constructing, cloning, sorting, synchronising, or changing ownership of the mutable collection.

#### Identity and ownership

Assignment copies only the object reference. Every alias sees the same strings, associated object references, capacity, ordering flags and event handlers. Adding, deleting, sorting or clearing through one variable changes the same collection observed through all others. Indexes shift as the list changes.

Ownership follows the producer:

- `TStringList.Create` returns a script-owned list that must normally be freed in `finally`;
- a list exposed by a host object or function can be borrowed and must not be freed unless its page explicitly transfers ownership;
- freeing the list invalidates every alias, iterator assumption and borrowed entry reference; and
- the script-exposed constructor does not own objects stored in the list, so freeing or deleting an entry does not free its associated `TObject`.

The alias adds no nil check. Calling a member through nil fails. Setting the local owner variable to nil after `Free` does not clear other references to the released object.

#### Ordering, text and concurrency boundaries

The target class retains its exact sorting and duplicate rules. Default comparison is locale-aware and case-insensitive; `Sort` and `Sorted=True` are not equivalent state, and manual movement can break a list that still claims to be sorted. Read the target class and member pages before relying on binary `Find`, duplicate policy or stable ordering.

String storage is Unicode, but `Text`, `DelimitedText`, file and stream operations each have their own delimiter, quoting, newline and encoding behavior. The alias does not select any of them. Converting to a [`TStringArray`](../Arrays/TStringArray.md) copies strings but not associated objects and does not keep the result synchronized.

Lists, callbacks and locale-sensitive comparison state are mutable and not thread-safe. Bound entry count and total text size when values come from untrusted input; many operations allocate proportional to the entire collection.

### Additional Technical Info
`StringList` is installed during every Velox script compilation with `AddTypeCopyN('StringList', 'TStringList')`. It is compile-time-equivalent to [`TStringList`](../../Classes/Lists/TStringList.md), not a constructor, immutable sequence, array conversion or collection copy.

**Related Code Library entries**

- [TStringList](../../Classes/Lists/TStringList.md) - complete public class, sorting, events and ownership behavior.
- [TStringArray](../Arrays/TStringArray.md) - independent dynamic array of copied String values.

**External references**

- [Embarcadero TStringList](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList) - authoritative Delphi class reference.
- [Free Pascal TStringList](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) - compatible overview; Velox executes the traced Delphi implementation.

<small>Created 2026-07-15</small>
