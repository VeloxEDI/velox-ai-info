---
title: "vxTimeFormat"
description: "Converts selected external minute tokens from m/mm to Delphi n/nn while protecting common AM/PM markers."
sidebar_position: 160
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - format
  - tokens
  - string
---

```Delphi
Function vxTimeFormat(const aTimeFormat: String): String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := vxTimeFormat('hh:mm:ss am/pm'); // hh:nn:ss am/pm
end;
```

### Usage

`vxTimeFormat` converts selected external minute tokens from m/mm to Velox n/nn while protecting common AM/PM markers.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aTimeFormat` | `String`, `const` | External mask to rewrite. The function does not validate its grammar. |

**Returns**

A copy after the ordered first-match substitutions described below.

**Errors**

No expected validation error because no grammar is checked. Normal string allocation errors can propagate.

**Usage notes**

Use this helper for the narrow single-token masks it was designed for. For arbitrary or repeated external format grammars, normalise tokens with a real parser or explicitly verified replacement strategy.

### Additional Technical Info
`vxTimeFormat` performs a small ordered text rewrite for external time masks that use `m`/`mm` for minutes. Delphi time formatting uses `n`/`nn` because `m` normally represents a month. This helper is a textual converter, not a format-string parser or formatter.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools import binds to `vxDateTools.vxTimeFormat`. The helper makes eight case-sensitive protection/replacement calls followed by four restoration calls. It temporarily changes the first `am`, `pm`, `AM` and `PM` to placeholders, replaces the first `mm`, `m`, `MM` and `M` with `nn`, `n`, `NN` and `N`, then restores the first corresponding placeholders.

Every call is Delphi `System.SysUtils.StringReplace(..., [])`. With an empty flag set it is case-sensitive and replaces only the first matching occurrence.

**Edge cases and quirks**

- Only the first match of each exact pattern is changed. For example, repeated minute fields are not reliably all converted.
- Replacement order matters. `mm:mm` becomes `nn:nm`: the first `mm` pass changes one pair, then the later single-`m` pass changes only the first character of the remaining pair.
- Only the first marker of each exact case (`am`, `pm`, `AM`, `PM`) is protected. Mixed-case `Am`/`Pm` and repeated markers are not protected.
- The function does not understand quoted literals or token boundaries. It can change an `m` inside ordinary text.
- It does not call `FormatDateTime`, inspect locale settings or verify that the resulting mask is accepted by another consumer.
- Empty input or a string with no matching tokens is returned unchanged.

**Side effects**

None; a new string result is returned.

**Performance and concurrency**

Twelve sequential string scans/allocations in the worst case, so work is proportional to input length with a small fixed multiplier. No shared mutable state.

**Related entries**

- [`FormatDateTime`](../Format/FormatDateTime.md) formats a value using Delphi mask semantics.
- `TimeToStr` uses host formatting rather than a caller-supplied mask; no current generated page exists for a cross-consumer link.

**External references**

The Velox rewrite is custom; these pages document the terminal replacement semantics that create its first-match behaviour:

- [Embarcadero `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringReplace)
- [Free Pascal `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html)

<small>Created 2026-07-15</small>
