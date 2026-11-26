---
title: "InvalidDateMonthWeekError"
description: "Raises the DateUtils invalid month-week conversion error for supplied ISO month-week fields."
sidebar_position: 67
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords:
  - velox
  - scripting
  - date
  - validation
  - exception
  - conversion
---

```Delphi
Procedure InvalidDateMonthWeekError(const AYear, AMonth, AWeekOfMonth, ADayOfWeek: Word)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  try
    InvalidDateMonthWeekError(2026, 2, 5, 1);
  except
    LogError('Operation failed: ' + ExceptionToString(ExceptionType, ExceptionParam));
    Exit;
  end;
end;
```

Follow [mandatory script failure handling](../../../instructions/scripts/failure-handling.md): a caught failure is not a successful Boolean/message result; log it as an error and stop.

### Usage

`InvalidDateMonthWeekError` raises the DateUtils invalid month-week conversion error for supplied ISO month-week fields.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Year value included in the formatted error. |
| `AMonth` | `Word`, `const` | Month value included in the formatted error. |
| `AWeekOfMonth` | `Word`, `const` | Week-within-month value included in the formatted error. |
| `ADayOfWeek` | `Word`, `const` | Monday-based weekday value included in the formatted error. |

**Behaviour**

- The procedure never returns normally.
- Use [`IsValidDateMonthWeek`](IsValidDateMonthWeek.md) when the script needs a Boolean range check rather than an exception.

**Important usage notes**

- The routine formats the supplied fields; it does not prove that the requested nth weekday exists in that month. Even completely valid-looking fields still cause the exception.
- The parameters are `Word` values, so negative numbers cannot be represented by the declared interface.

**Errors**

The intended and unconditional result is an `EConvertError`. The human-readable resource text can vary with the Velox runtime language or version; do not parse that message as a stable machine interface.

**Usage notes**

These DateUtils error helpers are principally useful to library code that has already detected invalid fields and wants the standard conversion error. Ordinary Velox scripts should normally validate first and provide business-specific handling rather than invoke this procedure directly.

### Additional Technical Info
`InvalidDateMonthWeekError` deliberately raises the DateUtils conversion exception for an invalid year, month, week-within-month and weekday. It is an error-construction helper, not a validator.

The example is fictional and source-reviewed. It catches the deliberately raised exception so that the surrounding flow can continue; it was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.InvalidDateMonthWeekError`. The procedure formats the applicable DateUtils resource string with the supplied numeric fields and immediately raises an `EConvertError`.

**Side effects**

Control leaves the current statement by exception. There is no external I/O or persistent mutation.

**Performance and concurrency**

Formatting and raising one exception is constant-time but substantially more expensive than returning a Boolean. The routine has no mutable state of its own; resource and formatting behaviour is supplied by the host runtime.

**Related entries**

- [`IsValidDateMonthWeek`](IsValidDateMonthWeek.md) performs the associated non-raising field check.
- [`InvalidDateTimeError`](InvalidDateTimeError.md) builds the general date/time conversion error and has additional base-value and locale behaviour.

**External references**

- [Embarcadero `System.DateUtils.InvalidDateMonthWeekError`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.InvalidDateMonthWeekError)
- [Free Pascal `InvalidDateMonthWeekError`](https://www.freepascal.org/docs-html/rtl/dateutils/invaliddatemonthweekerror.html)

<small>Created 2026-07-15</small>
