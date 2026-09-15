---
title: TDuplicates
description: Controls whether a sorted string list ignores, accepts or rejects a value that compares equal to an existing item.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, string-list, duplicates, sorted]
---

```Delphi
TDuplicates = (dupIgnore, dupAccept, dupError)
```

### Example

```Delphi
procedure ConfigureNames(Names: TStringList);
begin
  Names.Sorted := True;
  Names.Duplicates := dupError;
end;
```

### Usage

`TDuplicates` controls whether a sorted string list ignores, accepts or rejects a value that compares equal to an existing item.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `dupIgnore` | 0 | Leave the existing equal entry in place and do not add the new duplicate. |
| `dupAccept` | 1 | Insert the new entry even when an equal entry already exists. |
| `dupError` | 2 | Raise a duplicate-string/list exception instead of inserting. |

#### Behavior and boundaries

- Set `Sorted` and `Duplicates` before populating the list so every insertion follows one policy.
- On Velox `TStringList`, duplicate policy is meaningful for sorted insertion. An unsorted list can retain duplicates regardless of this setting.
- `dupIgnore` can hide an attempted update if the caller expected the new entry or its associated object to replace the old entry.
- `dupError` is the safest validation policy when duplicate input indicates malformed configuration, but callers must handle the exception and preserve partial-list state.

### Additional Technical Info
`TDuplicates` controls duplicate insertion policy for sorted list implementations such as `TStringList`. Equality follows the list's active comparison rules, including `CaseSensitive`; it is not necessarily byte-for-byte text identity.

The policy is consulted while a sorted list inserts a value. It does not retroactively scan or remove entries that were present before the policy changed.

**Related Code Library entries**

- [TStringList.Duplicates](../../Classes/Lists/TStringList/Properties/Duplicates.md) - exact property behavior.
- [TStringList.Sorted](../../Classes/Lists/TStringList/Properties/Sorted.md) - sorting prerequisite and reordering effects.
- [TStringList](../../Classes/Lists/TStringList.md) - list ownership and comparison context.

**External references**

- [Embarcadero TDuplicates](https://docwiki.embarcadero.com/Libraries/en/System.Classes.TDuplicates) - Delphi duplicate-policy definitions.
- [Free Pascal TDuplicates](https://www.freepascal.org/docs-html/rtl/classes/tduplicates.html) - compatible string-list duplicate type.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal and enumeration semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration and ordinal concepts.

<small>Created 2026-07-15</small>
