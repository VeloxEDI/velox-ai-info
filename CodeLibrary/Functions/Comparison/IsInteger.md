---
title: "IsInteger"
description: "Checks that non-empty text consists only of ASCII decimal digits."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - integer
  - lexical-validation
  - text
---

```Delphi
Function IsInteger( const S : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsInteger('0042');
end;
```

### Usage

`IsInteger` checks that non-empty text consists only of ASCII decimal digits.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Text to inspect exactly as supplied. |

**Returns**

`True` when the nonempty inspected prefix contains only ASCII digits; otherwise `False`.

**Behaviour**

Leading zeroes are accepted. A plus or minus sign is not accepted, and neither are spaces, decimal points, group separators or exponent notation.

**Errors**

The lexical scan has no normal exception path. A subsequent numeric conversion can still raise an invalid-value or overflow exception.

**Usage notes**

After this check, use the integer conversion and range required by the destination and handle conversion failure. If signed integers are permitted, validate the optional leading sign explicitly or use a parser with documented format rules.

### Additional Technical Info
`IsInteger` checks whether a nonempty string consists only of the ASCII characters `0` through `9`. It validates a lexical shape; it does not convert the text or prove that it fits a Velox/Delphi integer type.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox implementation returns `False` for `S = ''`, then scans a `PChar` until a null character. Each character must belong to the Delphi set `['0'..'9']`.

**Edge cases and quirks**

- `-1`, `+1`, ` 1`, `1 `, `1.0` and `1,000` all return `False`.
- Unicode digits outside ASCII `0` through `9` return `False`.
- There is no length or range check. A string containing thousands of digits can return `True` and still overflow every available integer conversion.
- An embedded `#0` ends the pointer scan. Characters after it are ignored; a nonempty string whose first character is `#0` can return `True`.
- The result does not distinguish identifiers with leading zeroes from canonical decimal representations.

**Side effects**

None.

**Performance and concurrency**

Time is linear in the inspected prefix. No transformed string is allocated and no shared mutable state is used.

**Related entries**

- [`IsNumber`](IsNumber.md) permits an optional leading sign and one period.
- [`IsCurrencyNumber`](IsCurrencyNumber.md) is a broader punctuation whitelist.
- [`Comparison`](../Comparison.md) explains why these lexical helpers are not numeric parsers.

<small>Created 2026-07-15</small>
