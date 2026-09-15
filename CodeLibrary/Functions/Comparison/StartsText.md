---
title: "StartsText"
description: "Reports whether text starts with a substring using Delphi's case-insensitive text comparison."
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - text
  - prefix
  - case-insensitive
---

```Delphi
Function StartsText( const ASubText, AText : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StartsText('ORD-', 'ord-1042');
end;
```

### Usage

`StartsText` reports whether text starts with a substring using Velox's case-insensitive text comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ASubText` | `string`, `const` | Prefix to test. |
| `AText` | `string`, `const` | Complete text whose beginning is inspected. |

**Returns**

`True` when the first `Length(ASubText)` characters of `AText` compare equal without case; otherwise `False`.

**Behaviour**

An empty prefix returns `True`, including for empty text. A non-empty prefix longer than the text returns `False`. A same-length prefix compares the complete strings. No trim or path parsing occurs.

**Errors**

There is no normal content-dependent Velox exception path. A failing Windows comparison becomes `False`, so an environmental API failure is indistinguishable from no match through this Boolean surface.

**Usage notes**

Use this function when linguistic ignore-case prefix matching is intended. For ASCII protocol tokens requiring environment-independent semantics, consider an ordinal comparison and document the accepted character set.

### Additional Technical Info
`StartsText` reports whether `AText` begins with `ASubText` without case sensitivity. Note the parameter order: the prefix is first and the complete text is second.

The example returns `True`. It uses fictional text, is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.StartsText`, which calls `AnsiStartsText`. Current Windows Delphi source first rejects a prefix longer than the text, then calls `CompareString` with `LOCALE_USER_DEFAULT`, `NORM_IGNORECASE`, and explicit prefix-length counts for both strings.

Because explicit counts are used, the comparison inspects only the prefix region and does not require null-terminated input. A Windows comparison failure returns zero and is surfaced as `False`; the last OS error is not raised or returned.

**Edge cases and quirks**

- Parameter order is `StartsText(ASubText, AText)`, the same as [`EndsText`](EndsText.md) but opposite to [`ContainsText`](ContainsText.md)'s text-then-subtext order.
- Non-ASCII case behaviour follows the user-default Windows locale of the Velox process account. Results can differ between interactive Designer use and a service account with different locale settings.
- Linguistic ignore-case comparison is not byte identity and does not perform explicit Unicode normalisation.
- Embedded null code units are included because the RTL supplies explicit lengths.
- Leading whitespace and punctuation are significant. The function does not establish that a prefix is a safe identifier, path or message type.
- On non-Windows Delphi targets the RTL takes a different `SameText`/copy path; deployed Velox Windows behaviour is the contract described here.

**Side effects**

None.

**Performance and concurrency**

After a constant-time length check, work is proportional to the prefix length. Current Windows code does not allocate a substring. The function has no private shared state; user-locale settings remain environmental state.

**Related entries**

- [`EndsText`](EndsText.md) tests a suffix and currently follows a different system-locale helper path.
- [`ContainsText`](ContainsText.md) searches anywhere in the text.
- [`SameText`](SameText.md) compares complete strings using ordinal ASCII case folding.
- [`MatchPattern`](MatchPattern.md) adds `*` and `?` wildcards with ASCII-only folding.

**External references**

- [Embarcadero `System.StrUtils.StartsText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.StartsText)
- [Free Pascal `StartsText`](https://www.freepascal.org/docs-html/rtl/strutils/startstext.html) - compatible API context; current Delphi and Windows locale paths define Velox behaviour.
- [Microsoft `CompareStringW`](https://learn.microsoft.com/en-us/windows/win32/api/stringapiset/nf-stringapiset-comparestringw) - terminal Windows comparison API used by the current RTL.

<small>Created 2026-07-15</small>
