---
title: "IsNumber"
description: "Checks a non-empty lexical number made from digits, one period and an optional leading sign."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - number
  - lexical-validation
  - text
---

```Delphi
Function IsNumber( const S : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsNumber('-12.50');
end;
```

### Usage

`IsNumber` checks a non-empty lexical number made from digits, one period and an optional leading sign.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Text inspected exactly as supplied. The function does not trim it. |

**Returns**

`False` for an empty string, an unrecognised inspected character, a second period or a sign after the first position. Otherwise `True`.

**Behaviour**

Conventional forms such as `12`, `-12`, `+12.5`, `.5` and `5.` pass. The decimal separator is always a literal period; machine and user locale settings are ignored.

**Errors**

The lexical scan has no normal exception path. Subsequent conversion can still raise for sign-only/period-only text, range overflow or a mismatched decimal-format contract.

### Additional Technical Info
`IsNumber` checks a small, locale-independent lexical shape: ASCII digits, at most one period, and `+` or `-` only in the first character. It does not parse the text or guarantee that a numeric conversion will succeed.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox routine scans a `PChar` until the first null character. It permits characters in `['0'..'9', '.', '-', '+']`, tracks whether a period has already appeared, and tracks whether it is still at the first character for sign placement.

It does not track whether any digit appeared.

**Edge cases and quirks**

- Because no digit is required, `.`, `+`, `-`, `+.`, `-.` and similar forms return `True` even though normal numeric conversion can reject them.
- A plus or minus is accepted only as the first character. Exponent forms such as `1E-3` are rejected because `E` is not allowed.
- A second period is rejected. Commas, spaces and non-ASCII digits are rejected.
- The function performs no range, precision or overflow check.
- An embedded `#0` ends scanning and hides later characters. A nonempty string starting with `#0` can return `True` without supplying a digit.
- `True` means only that the inspected prefix fits this state machine; it is not a successful parse result.

**Side effects**

None.

**Performance and concurrency**

Time is linear in the inspected prefix. The routine allocates no transformed string and uses no shared mutable state.

**Remarks**

Follow this filter with the conversion function and explicit `TFormatSettings`/domain range required by the source contract. If the goal is simply to know whether conversion is possible, a `TryStrToFloat`-style operation under explicit format settings is a stronger test.

**Related entries**

- [`IsInteger`](IsInteger.md) accepts nonempty ASCII digits only.
- [`IsCurrencyNumber`](IsCurrencyNumber.md) is a much broader character whitelist.
- [`IsZeroEpsilon`](IsZeroEpsilon.md) compares a value after it has been converted.

<small>Created 2026-07-15</small>
