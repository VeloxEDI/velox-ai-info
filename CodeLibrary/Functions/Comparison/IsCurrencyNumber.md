---
title: "IsCurrencyNumber"
description: "Checks that non-empty text contains only digits and the characters period, comma, dollar sign, minus or plus."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - currency
  - lexical-validation
  - text
---

```Delphi
Function IsCurrencyNumber( const S : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsCurrencyNumber('$1,234.50');
end;
```

### Usage

`IsCurrencyNumber` checks that non-empty text contains only digits and the characters period, comma, dollar sign, minus or plus.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Text whose characters are inspected. No trimming or normalisation is performed. |

**Returns**

`False` for an empty string or when any inspected character is outside the whitelist. Otherwise `True`.

**Behaviour**

The check is deliberately locale-independent. It accepts the literal period, comma and dollar sign regardless of the machine's decimal separator, thousand separator or currency symbol. ASCII digits alone also pass.

**Errors**

There is no normal exception path for a valid Velox string. Conversion or range errors can still occur later if the caller treats a `True` result as proof that the text parses.

**Usage notes**

Use this as an early filter only when this exact whitelist is required. A production currency rule should normally also define the currency, decimal/group separators, permitted sign notation, scale, rounding and range, then parse using those explicit format settings.

### Additional Technical Info
`IsCurrencyNumber` checks whether a nonempty string contains only ASCII digits and the six punctuation characters `.`, `,`, `$`, `-` and `+`. It is a character-whitelist helper, not a currency parser or a complete numeric validator.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox function converts the Delphi string to `PChar`, advances until the first null character, and rejects a character unless it belongs to:

```text
0..9  .  ,  $  -  +
```

It does not call a Delphi currency conversion routine, inspect format settings or count/position punctuation.

**Edge cases and quirks**

- Symbols can appear in any order, any position and any number of times. Values such as `$$`, `+--`, `1,2.3`, `.,` and `$-` all pass the character whitelist.
- No digit is required. Punctuation-only text can return `True`.
- Leading/trailing whitespace, parentheses, other currency symbols and non-ASCII digits return `False`.
- The function does not enforce one decimal separator, valid grouping, sign position, decimal places, numeric range or currency code.
- An embedded `#0` terminates the pointer loop. Any characters after it are ignored; a nonempty string beginning with `#0` can return `True` without inspecting later content.
- The name can overstate the guarantee. `True` means only "all inspected characters are in this whitelist".

**Side effects**

None.

**Performance and concurrency**

Time is linear in the inspected prefix up to the first null character. The function allocates no transformed string and uses no shared mutable state.

**Related entries**

- [`IsNumber`](IsNumber.md) applies tighter sign and decimal-point placement but still does not parse.
- [`IsInteger`](IsInteger.md) accepts ASCII digits only.
- [`Comparison`](../Comparison.md) distinguishes lexical checks from numeric comparison.

<small>Created 2026-07-15</small>
