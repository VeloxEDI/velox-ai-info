---
title: SortByDomain
description: Stably bubble-sorts by case-sensitive locale domain order by swapping and reparsing Text content between fixed item objects.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, domain, sort, identity]
---

```Delphi
procedure SortByDomain;
```

### Example

```Delphi
procedure OrderByDomain(const Addresses: TIdEMailAddressList);
begin
  // Do not retain item references as recipient identities across this call.
  Addresses.SortByDomain;
end;
```

### Usage

`SortByDomain` stably bubble-sorts by case-sensitive locale domain order by swapping and reparsing Text content between fixed item objects.

### Additional Technical Info
`SortByDomain` runs a full bubble-sort schedule over adjacent entries. It compares derived domain Strings through Indy's `IndyCompareStr`, which calls Delphi `AnsiCompareStr` in this build.

The comparison is case-sensitive and locale-aware. It does not lowercase or canonicalize domains first. Consequently `Example.invalid` and `example.invalid` can sort separately, and ordering can depend on the process/operating-system locale. Equal comparisons are not swapped, so the algorithm is stable relative to its comparator.

#### Critical identity behavior

The method does not move collection objects. For an out-of-order pair it saves `Items[j].Text`, assigns the right item's Text into the left item, then assigns the saved Text into the right item.

Item object references, collection IDs and indexes therefore stay fixed while their recipient content changes. A variable that referred to "Alice" before sorting can refer to "Bob" afterwards. Do not retain `TIdEMailAddressItem` references as recipient identities across this operation; reacquire items and inspect them after sorting.

Swapping through [`Text`](../../TIdEMailAddressItem/Properties/Text.md) formats and reparses each pair. This can normalize quotes, spaces, comments and malformed content, and it inherits the formatter/parser defects. It is not a byte-preserving swap of raw fields. If a setter or allocation raises between the two assignments, a pair can temporarily duplicate one value and lose the other; there is no rollback.

The implementation performs `Count` outer passes and `Count - 1` adjacent comparisons per pass regardless of whether the list becomes sorted early. Time is O(n²), plus repeated formatting/parsing and managed-string allocation. This is unsuitable for very large recipient collections.

No collection item is added or deleted. The `Text`/raw-field setters do not call inherited `Changed`, so this complete recipient-content reorder does not issue a normal collection item-change notification. Owner/UI state that relies on such notifications can remain stale. The list and retained item references are mutable and not thread-safe.

The source-reviewed example explicitly warns about identity. It was not executed by the documentation workflow.

**External references**

- [Indy upstream: `TIdEMailAddressList.SortByDomain`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - exact content-swapping bubble sort.
- [Embarcadero DocWiki: `System.SysUtils.AnsiCompareStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.AnsiCompareStr) - Delphi case-sensitive comparison terminal.
- [Free Pascal: `AnsiCompareStr`](https://www.freepascal.org/docs-html/rtl/sysutils/ansicomparestr.html) - compatible reference; Velox uses the traced Delphi runtime.

<small>Created 2026-07-15</small>
