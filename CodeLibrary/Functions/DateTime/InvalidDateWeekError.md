---
title: "InvalidDateWeekError"
description: "Raises the DateUtils invalid ISO week-date conversion error for supplied year, week and weekday fields."
sidebar_position: 69
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - validation
  - exception
  - conversion
---

```Delphi
Procedure InvalidDateWeekError(const AYear, AWeekOfYear, ADayOfWeek: Word)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  try
    InvalidDateWeekError(2026, 54, 1);
  except
    Value := 'Invalid date fields were rejected';
  end;
end;
```

### Usage

`InvalidDateWeekError` raises the DateUtils invalid ISO week-date conversion error for supplied year, week and weekday fields.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | ISO week-numbering year value included in the formatted error. |
| `AWeekOfYear` | `Word`, `const` | Week number included in the formatted error. |
| `ADayOfWeek` | `Word`, `const` | Monday-based weekday number included in the formatted error. |

**Behaviour**

- The procedure never returns normally.
- Use [`IsValidDateWeek`](IsValidDateWeek.md) when the script needs a Boolean range check rather than an exception.

**Important usage notes**

- No validation is performed here. The procedure always raises, including when the supplied week-date fields would otherwise be valid.
- The parameters are `Word` values, so negative numbers cannot be represented by the declared interface.

**Errors**

The intended and unconditional result is an `EConvertError`. The human-readable resource text can vary with the Velox runtime language or version; do not parse that message as a stable machine interface.

**Usage notes**

These DateUtils error helpers are principally useful to library code that has already detected invalid fields and wants the standard conversion error. Ordinary Velox scripts should normally validate first and provide business-specific handling rather than invoke this procedure directly.

### Additional Technical Info
`InvalidDateWeekError` deliberately raises the DateUtils conversion exception for an invalid ISO week-numbering year, week and weekday. It is an error-construction helper, not a validator.

The example is fictional and source-reviewed. It catches the deliberately raised exception so that the surrounding flow can continue; it was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.InvalidDateWeekError`. The procedure formats the applicable DateUtils resource string with the supplied numeric fields and immediately raises an `EConvertError`.

**Side effects**

Control leaves the current statement by exception. There is no external I/O or persistent mutation.

**Performance and concurrency**

Formatting and raising one exception is constant-time but substantially more expensive than returning a Boolean. The routine has no mutable state of its own; resource and formatting behaviour is supplied by the host runtime.

**Related entries**

- [`IsValidDateWeek`](IsValidDateWeek.md) performs the associated non-raising field check.
- [`InvalidDateTimeError`](InvalidDateTimeError.md) builds the general date/time conversion error and has additional base-value and locale behaviour.

**External references**

- [Embarcadero `System.DateUtils.InvalidDateWeekError`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.InvalidDateWeekError)
- [Free Pascal `InvalidDateWeekError`](https://www.freepascal.org/docs-html/rtl/dateutils/invaliddateweekerror.html)

<small>Created 2026-07-15</small>
