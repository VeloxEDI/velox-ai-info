---
title: "IsPM"
description: "Reports whether a `TDateTime` has an encoded hour from 12 through 23."
sidebar_position: 72
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - validation
  - boolean
---

```Delphi
Function IsPM(const AValue: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 12, 0, 0, 0);
  Value := IsPM(InputValue); // True at noon
end;
```

### Usage

`IsPM` reports whether a `TDateTime` has an encoded hour from 12 through 23.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose hour component is inspected. |

**Returns**

`True` when the decoded hour is 12 through 23; `False` for hours 0 through 11.

**Behaviour**

- Exactly 12:00 noon is PM.
- Midnight (`00:00`) is not PM; 23:59:59.999 is PM.
- The date fields do not affect the result and no locale-specific AM/PM text is consulted.

**Important usage notes**

- The function inspects the untagged encoded hour. It does not convert UTC to local time or account for a timezone.
- Invalid or non-finite input can raise while its time is decoded.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsPM` reports whether a `TDateTime` has an encoded hour from 12 through 23.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsPM`. It obtains the hour with `HourOf`, which decodes the time component, and evaluates `HourOf(AValue) >= 12`.

**Side effects**

None.

**Errors**

There is no wrapper exception handling. Invalid or non-finite encoded values can raise during decoding or produce non-useful comparisons rather than a meaningful Boolean.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`HourOf`](HourOf.md) returns the decoded hour component.
- [`IsValidTime`](IsValidTime.md) validates explicit time fields.

**External references**

- [Embarcadero `System.DateUtils.IsPM`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsPM)
- [Free Pascal `IsPM`](https://www.freepascal.org/docs-html/rtl/dateutils/ispm.html)

<small>Created 2026-07-15</small>
