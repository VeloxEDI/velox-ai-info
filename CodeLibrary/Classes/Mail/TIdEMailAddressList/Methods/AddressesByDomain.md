---
title: AddressesByDomain
description: Clears a separate destination list and fills it with Text-round-tripped copies whose derived domains compare equal case-insensitively.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, domain, filter, destructive]
---

```Delphi
procedure AddressesByDomain(AList: TIdEMailAddressList;
  const ADomain: string);
```

### Example

```Delphi
procedure SelectDomain(const Source, Target: TIdEMailAddressList);
begin
  if (Target <> nil) and (Target <> Source) then
    Source.AddressesByDomain(Target, 'example.invalid');
end;
```

### Usage

`AddressesByDomain` clears a separate destination list and fills it with Text-round-tripped copies whose derived domains compare equal case-insensitively.

### Additional Technical Info
`AddressesByDomain` replaces a destination list with copies of source items whose derived `Domain` matches `ADomain` through Indy's `TextIsSame`, which calls Delphi `AnsiCompareText` in the current build.

| Parameter | Meaning |
|---|---|
| `AList` | Borrowed destination list. It must be non-nil and must not be the source object. |
| `ADomain` | Comparison text. It is not trimmed, normalized or validated. |

The first operation is `AList.Clear`. There is no nil guard, so nil fails immediately. More critically, passing the source as `AList` clears it before the loop obtains any entries; the method returns with the source empty. Always use a distinct destination.

Matching reads each item's [`Domain`](../../TIdEMailAddressItem/Properties/Domain.md), which splits raw `Address` at the last at-sign. Addresses with no at-sign have empty domain and therefore match an empty `ADomain`.

`AnsiCompareText` is case-insensitive and locale-aware rather than an explicit invariant DNS comparison. The parameter is not lowercased. For deterministic domain policy, canonicalize valid domains independently before this call.

For each match the method adds a destination item and assigns its [`Text`](../../TIdEMailAddressItem/Properties/Text.md) from the source's formatted `Text`. This parse/format round-trip does not preserve item identity and can normalize comments, spacing, quoting or malformed content. It differs from [`AddItems`](AddItems.md), which copies raw Address and Name fields.

The operation is non-transactional. Destination contents are destroyed before scanning. An exception can leave it empty or partially populated, and target owner callbacks can observe intermediate changes. Use a separately owned staging list and swap at a higher level when replacement must be atomic.

The scan is O(n) plus formatting/parsing allocation for each match. Source, destination and their owners are mutable and not thread-safe.

The source-reviewed example enforces both destination preconditions and uses a reserved domain. It did not execute SMTP or runtime mail code.

**External references**

- [Indy upstream: `TIdEMailAddressList.AddressesByDomain`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - clear-first filtering and Text-copy implementation.
- [Embarcadero DocWiki: `System.SysUtils.AnsiCompareText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.AnsiCompareText) - Delphi comparison terminal.
- [Free Pascal: `AnsiCompareText`](https://www.freepascal.org/docs-html/rtl/sysutils/ansicomparetext.html) - compatible comparison reference; Velox uses the traced Delphi runtime.

<small>Created 2026-07-15</small>
