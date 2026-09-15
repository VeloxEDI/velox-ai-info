---
title: FillTStrings
description: Appends every item's formatted Text to a caller-owned string list without clearing, batching or checking for nil.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, strings, append, formatting]
---

```Delphi
procedure FillTStrings(AStrings: TStrings);
```

### Example

```Delphi
procedure CollectFormatted(const Addresses: TIdEMailAddressList;
  const Lines: TStrings);
begin
  Lines.Clear;
  Addresses.FillTStrings(Lines);
end;
```

### Usage

`FillTStrings` appends every item's formatted Text to a caller-owned string list without clearing, batching or checking for nil.

### Additional Technical Info
`FillTStrings` iterates the address list in current order and calls `AStrings.Add(Item.Text)` for each entry.

| Parameter | Meaning |
|---|---|
| `AStrings` | Borrowed mutable target. It must be non-nil; the method neither clears nor frees it. |

Existing target strings remain, so the method appends rather than replaces. Clear explicitly first when replacement is intended, as in the example. In contrast, [`GetDomains`](GetDomains.md) always clears its target.

Each added value is the item's formatted [`Text`](../../TIdEMailAddressItem/Properties/Text.md), not raw `Address`. Display names, angle brackets and quoting can therefore appear. Formatter quirks—including the local-part period shortcut—remain applicable; output is not an address-validity verdict.

There is no nil check and no `BeginUpdate`/`EndUpdate` wrapper. A nil target raises on the first dereference. A concrete `TStringList` can fire its change callbacks for each addition unless the caller brackets this call in an update. Its `Sorted`, `Duplicates` and case/locale settings can reorder, ignore or reject added values instead of preserving a simple one-for-one append.

The operation is non-transactional. Formatting, allocation, duplicate-policy or target callback exceptions propagate after any earlier values have already been appended. The address source is not modified.

Time is O(n) plus each formatter and target insertion cost; insertion into a maintained sorted `TStringList` adds search/movement cost. Source and target are mutable and not thread-safe.

The source-reviewed example controls replacement explicitly and assumes a valid borrowed target. It was not executed by the documentation workflow.

**External references**

- [Indy upstream: `TIdEMailAddressList.FillTStrings`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - exact append loop.
- [Embarcadero DocWiki: `System.Classes.TStrings.Add`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Add) - Delphi target operation.
- [Free Pascal: `TStrings.Add`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.add.html) - compatible target reference; concrete target behavior can still vary.

<small>Created 2026-07-15</small>
