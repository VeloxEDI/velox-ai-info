---
title: Create
description: Creates an empty caller-owned string list with Delphi's unsorted, locale-aware and non-owning defaults.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, string-list, constructor, defaults, ownership]
---

```Delphi
constructor Create;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Lines: TStringList;
begin
  Lines := TStringList.Create;
  try
    Lines.Add('first');
    Lines.Add('second');
    Value := Lines.Count;
  finally
    Lines.Free;
  end;
end;
```

### Usage

Creates an empty caller-owned string list with Velox's unsorted, locale-aware and non-owning defaults.

### Additional Technical Info
`Create` constructs an empty native Delphi [`TStringList`](../../TStringList.md). It calls the hidden `TStrings` constructor, records whether a descendant has overridden comparison/object access, and performs no string-array allocation until content is added.

The returned object is caller-owned. Free it in a `finally` block. Assigning it to another variable creates another reference to the same object, not a copy or ownership transfer.

The exact initial state is:

- `Count=0`, `Capacity=0` and `Sorted=False`;
- [`Duplicates`](../Properties/Duplicates.md) is `dupIgnore` (the zero-valued enumeration member);
- [`CaseSensitive`](../Properties/CaseSensitive.md) is false;
- [`OnChange`](../Properties/OnChange.md) and [`OnChanging`](../Properties/OnChanging.md) are nil;
- native `OwnsObjects=False`;
- inherited `Delimiter=','`, `QuoteChar='"'`, `NameValueSeparator='='` and `StrictDelimiter=False`; and
- hidden inherited options use locale-aware comparison, write a byte-order mark where the selected encoding has one, and include a trailing line break in generated text.

Velox registers only this parameterless overload. Native Delphi overloads for object ownership, delimiter/options or preconfigured sort settings are not script-callable here. Set the exposed properties immediately after construction when deterministic ordering/duplicate behavior is required.

The native `OwnsObjects` and `UseLocale` controls are not exposed by the current importer. A script-created list never owns objects attached through `AddObject`/`Objects`, and its comparison remains locale-aware. Freeing the list releases its strings and backing array but not those borrowed objects.

Construction itself does not fire list events and is effectively constant-time. Later allocation and event failures propagate from the operation that triggers them. The list is not thread-safe.

The source-reviewed example follows the required caller-owned lifetime pattern. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.Create`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Create) - Delphi constructor family; Velox exposes only the parameterless overload.
- [Free Pascal: `TStringList`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) - compatible class construction context.

<small>Created 2026-07-15</small>
