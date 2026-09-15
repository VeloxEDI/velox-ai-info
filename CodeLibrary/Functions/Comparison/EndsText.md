---
title: "EndsText"
description: "Reports whether text ends with a substring using Delphi's case-insensitive text comparison."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - text
  - suffix
  - case-insensitive
---

```Delphi
Function EndsText( const ASubText, AText : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EndsText('.CSV', 'orders.csv');
end;
```

### Usage

`EndsText` reports whether text ends with a substring using Velox's case-insensitive text comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ASubText` | `string`, `const` | Suffix to test. |
| `AText` | `string`, `const` | Complete text whose ending is inspected. |

**Returns**

`True` when `AText` has `ASubText` as a case-insensitive suffix; otherwise `False`.

**Behaviour**

An empty suffix returns `True`, including for empty text. A nonempty suffix longer than the text returns `False`. A suffix equal in length compares against the complete text.

Case differences accepted by the current Velox string comparison do not prevent a match. The routine does not remove whitespace, punctuation or path separators before testing.

**Errors**

There is no normal content-dependent exception path.

**Usage notes**

Use this function when an ignore-case textual suffix is the actual rule. For file processing, combine it with the flow's path, existence, source-monitor and security checks rather than treating the suffix as validation.

### Additional Technical Info
`EndsText` reports whether `AText` ends with `ASubText` without case sensitivity. Note the parameter order: the suffix is first and the complete text is second.

The example returns `True`. It uses fictional text, is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox binds directly to `System.StrUtils.EndsText`, which reaches Delphi's `AnsiEndsText` and `TStringHelper.EndsText` path in the current RTL. The helper compares the final portion with `coIgnoreCase` and `SysLocale.DefaultLCID` rather than searching the entire string.

**Edge cases and quirks**

- Parameter order is opposite to [`ContainsText`](ContainsText.md): `EndsText(ASubText, AText)` versus `ContainsText(AText, ASubText)`.
- An empty suffix returns `True`, while an empty substring passed to current `ContainsText` returns `False`.
- Ignore-case string comparison is not Unicode normalisation. Canonically equivalent but differently encoded endings can fail to match.
- Culture and Unicode case details come from the deployed Delphi string helper's system-default locale and can differ from [`CompareText`](CompareText.md)'s ordinal ASCII folding.
- The function tests text only. For filesystem names it does not establish that a path exists, is a file or is safe to process.
- Trailing spaces are significant; `EndsText('.csv', 'orders.csv ')` returns `False`.

**Side effects**

None.

**Performance and concurrency**

Work is proportional to the suffix length after an initial length check. It does not search earlier text. The function has no private shared state; any culture behaviour belongs to the RTL comparison environment.

**Related entries**

- [`ContainsText`](ContainsText.md) searches anywhere in text and uses a different parameter order.
- [`CompareText`](CompareText.md) returns case-insensitive ordinal ordering.
- [`Comparison`](../Comparison.md) summarises text comparison differences.

**External references**

- [Embarcadero `System.StrUtils.EndsText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.EndsText)
- [Free Pascal `EndsText`](https://www.freepascal.org/docs-html/rtl/strutils/endstext.html) — compatible API context; the deployed Delphi RTL defines Velox's exact ignore-case behaviour.

<small>Created 2026-07-15</small>
