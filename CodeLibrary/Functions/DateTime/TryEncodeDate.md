---
title: "TryEncodeDate"
description: "Validates Gregorian year, month and day fields and assigns their midnight date only on success."
sidebar_position: 146
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - encoding
  - validation
  - delphi
---

```Delphi
function TryEncodeDate(Year, Month, Day: Word;
  var Date: TDateTime): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedDate: TDateTime;
begin
  if TryEncodeDate(2028, 2, 29, EncodedDate) then
    Value := EncodedDate
  else
    Value := 0;
end;
```

### Usage

`TryEncodeDate` validates Gregorian year, month and day fields and assigns their midnight date only on success.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Year` | `Word` | Gregorian year `1..9999`. |
| `Month` | `Word` | Month `1..12`. |
| `Day` | `Word` | One-based day valid for the supplied month and year. |
| `Date` | `TDateTime`, `var` | Receives the encoded midnight only when the function succeeds. |

**Returns**

`True` when all fields form an encodable date; otherwise `False`.

**Behaviour**

- Successful output is at `00:00:00.000`.
- Leap-year rules include the Gregorian century exception: 2000 is a leap year; 2100 is not.
- Validation is combination-aware, so 31 April and 29 February in a common year return `False`.

**Errors**

Expected field-range failures return `False`. Unexpected Velox errors can still raise instead of returning `False`.

### Additional Technical Info
`TryEncodeDate` validates a Gregorian year, month and day and, on success, writes the corresponding midnight `TDateTime`. It reports invalid input with `False` instead of raising the normal date-encoding conversion exception.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript runtime registers a Velox adapter with the exact script signature above. That adapter delegates directly to installed Delphi 37.0 `System.SysUtils.TryEncodeDate`. The terminal selects the normal/leap-year month table, checks all ranges, accumulates preceding month lengths and converts the Gregorian ordinal to Delphi's day number.

**Edge cases and quirks**

- The script exposes `Date` as `var`, while the installed terminal declares an `out` parameter. For this unmanaged numeric type the terminal assigns it only on success. Treat its previous value as unchanged but not useful when the result is `False`; always branch on the Boolean.
- Fields are not normalised or carried. Month 13 and day 0 fail.
- The output has no timezone meaning. It is simply a Gregorian date at encoded midnight.
- Unlike `EncodeDate`, invalid fields do not raise `EConvertError` through this normal path.

**Side effects**

Writes `Date` only on success. No global state or I/O is used.

**Performance and concurrency**

Constant bounded calendar arithmetic with no allocation or shared mutable state.

**Related entries**

- [`EncodeDate`](EncodeDate.md) raises when the same fields are invalid.
- [`TryEncodeDateTime`](TryEncodeDateTime.md) combines date and millisecond time validation.
- [`IsValidDate`](IsValidDate.md) validates without producing an output value.

**External references**

- [Embarcadero `System.SysUtils.TryEncodeDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TryEncodeDate)
- [Free Pascal `TryEncodeDate`](https://www.freepascal.org/docs-html/rtl/sysutils/tryencodedate.html)

<small>Created 2026-07-15</small>
