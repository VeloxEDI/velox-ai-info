---
title: GetDomains
description: Clears a supplied strings object and fills it with first-seen unique lowercase derived domains, including an empty-domain entry.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, domain, unique, lowercase]
---

```Delphi
procedure GetDomains(AStrings: TStrings);
```

### Example

```Delphi
procedure ListDomains(const Addresses: TIdEMailAddressList;
  const Domains: TStrings);
begin
  Addresses.GetDomains(Domains);
  // Domains has been cleared and repopulated.
end;
```

### Usage

`GetDomains` clears a supplied strings object and fills it with first-seen unique lowercase derived domains, including an empty-domain entry.

### Additional Technical Info
`GetDomains` replaces a caller-supplied string collection with distinct lowercase values derived from every address item's `Domain`.

| Parameter | Meaning |
|---|---|
| `AStrings` | Borrowed mutable output. Nil is accepted and produces no change. Non-nil output is cleared first. |

For a non-nil target, the method calls `BeginUpdate`, clears it, then for each address computes `LowerCase(Item.Domain)`. It uses the target's `IndexOf` to test uniqueness and calls `Add` only when absent. `EndUpdate` runs in a `finally` block.

An address without an at-sign has an empty derived domain. The empty String is therefore a legitimate emitted value (at most once), not silently skipped. Malformed multiple-at addresses contribute the suffix after the last at-sign.

Lowercasing uses Delphi `SysUtils.LowerCase` without an explicit invariant locale. It does not validate DNS labels, remove whitespace, trim a trailing dot, apply IDNA/Punycode or normalize Unicode. Treat results as implementation-derived grouping keys, not canonical Internet domains.

Target settings remain significant. A default unsorted `TStringList` preserves first-seen domain order. A sorted target can reorder additions, and its case/duplicate/comparison policy participates in `IndexOf` and `Add`. The method clears content but does not reset those settings or associated callbacks.

The operation is non-transactional. Errors or callbacks can leave a cleared or partially populated target, though update state is balanced. Source addresses are unchanged.

The loop is O(n*m) with a linear unsorted `IndexOf` over up to `m` unique domains; a sorted concrete target can use different lookup/insertion costs. Both source and target are mutable and not thread-safe.

The source-reviewed example makes the destructive output contract explicit and was not executed.

**External references**

- [Indy upstream: `TIdEMailAddressList.GetDomains`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - exact clear/lowercase/IndexOf loop.
- [Embarcadero DocWiki: `System.SysUtils.LowerCase`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.LowerCase) - Delphi lowercase terminal.
- [Free Pascal: `LowerCase`](https://www.freepascal.org/docs-html/rtl/sysutils/lowercase.html) - compatible lowercase reference; Velox executes current Delphi.

<small>Created 2026-07-15</small>
