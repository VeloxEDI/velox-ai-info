---
title: "RoundAs"
description: "Dispatches to one of three named Velox rounding algorithms or returns the input unchanged for any other token."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - rounding
  - dispatch
---

```Delphi
function RoundAs(const aRountType: string; aValue: Extended; aDP: Integer): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RoundAs('ROUND2BR', 12.25, 1); // normally 12.2
end;
```

### Usage

`RoundAs` selects one of three named Velox rounding methods or returns the input unchanged for any other token.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aRountType` | `string`, `const` | Selector. Recognized after upper-casing as exactly `ROUND2UP`, `ROUND2BR` or `ROUND2`. |
| `aValue` | `Extended` | Value passed to the selected helper or returned unchanged. |
| `aDP` | `Integer` | Decimal-place argument passed through unchanged. |

**Selection guidance**

Validate configuration tokens against the three exact names before calling. For a fixed design-time policy, calling the selected helper directly is clearer and avoids silent fallback.

### Additional Technical Info
`RoundAs` selects one of the three Velox rounding helpers by an ASCII token. Comparison is case-insensitive through `UpperCase`, but no trim is performed. Any unrecognized token silently returns `aValue` unchanged.

The public parameter name contains the source typo `aRountType`; scripts must follow the positional/type contract and documentation should preserve that spelling. The example is fictional and source-reviewed only.

**Returns and dispatch table**

| Selector after `UpperCase` | Operation |
|---|---|
| `ROUND2UP` | [`Round2Up(aValue, aDP)`](Round2Up.md) |
| `ROUND2BR` | [`Round2BR(aValue, aDP)`](Round2BR.md) |
| `ROUND2` | [`Round2(aValue, aDP)`](Round2.md) |
| anything else | `aValue` unchanged |

**Implementation details and quirks**

- `UpperCase` makes ordinary ASCII letter case irrelevant: `'round2br'` is recognized.
- No whitespace is removed. `' ROUND2BR'`, `'ROUND2BR '` and an empty string all take the silent unchanged fallback.
- No warning, Boolean success result or log item indicates that the selector was unknown. A spelling/configuration error can therefore look like successful rounding.
- The function evaluates all three arguments before dispatch, as with any normal Pascal function call.
- Every behavior/error of the selected helper is inherited: `Round2`'s six-tenths threshold, `Round2BR`'s Double/current-mode conversion, and `Round2Up`'s locale/text/negative-place hazards.
- An unknown selector avoids all helper arithmetic and returns the original bits/value, including NaN/infinity.

**Side effects**

The function and its three targets have no intended external side effect. Exceptions from token conversion or a selected algorithm propagate.

**Related entries**

- [`Round`](Round.md) is the PascalScript whole-number operation and is not selectable here.

**External references**

- [Free Pascal: `SysUtils.UpperCase`](https://www.freepascal.org/docs-html/rtl/sysutils/uppercase.html)
- [Embarcadero DocWiki: `System.SysUtils.UpperCase`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.UpperCase)

<small>Created 2026-07-15</small>
