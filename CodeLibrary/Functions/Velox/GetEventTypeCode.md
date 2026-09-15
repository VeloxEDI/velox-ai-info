---
title: "GetEventTypeCode"
description: "Converts a Velox event type number to its canonical code."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - event-type
  - mapping
  - variant
---

```Delphi
Function GetEventTypeCode(const aEventType : Variant) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetEventTypeCode(41); // 'SendPartner'
end;
```

### Usage

`GetEventTypeCode` converts a Velox event type number to its canonical code.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aEventType` | `Variant`, `const` | Numeric event type. Supply one of the integral values in the table. |
| Result | `Variant` | Canonical code string for a recognized number; otherwise `Null`. |

**Complete mapping**

| Number | Code |
|---:|---|
| `0` | `ReceiveCompany` |
| `1` | `SendCompany` |
| `2` | `SendUpdateCompany` |
| `3` | `SendControlCompany` |
| `21` | `NotifyCompany` |
| `22` | `NotifyUpdateCompany` |
| `23` | `NotifyIssueCompany` |
| `24` | `NotifyErrorCompany` |
| `40` | `ReceivePartner` |
| `41` | `SendPartner` |
| `42` | `SendUpdatePartner` |
| `43` | `SendControlPartner` |
| `44` | `SendCollectPartner` |
| `45` | `SendDeliverPartner` |
| `61` | `NotifyPartner` |
| `62` | `NotifyUpdatePartner` |
| `63` | `NotifyIssuePartner` |
| `64` | `NotifyErrorPartner` |
| `101` | `CreatePODPDF` |
| `102` | `EmailPODPDF` |
| `103` | `SendPODXML` |

### Additional Technical Info
`GetEventTypeCode` converts a numeric Velox EDI event type to its canonical source-defined code. The mapping covers company, partner, notification and proof-of-delivery event families. It is hard-coded and does not read event definitions from the database.

**Implementation**

The function evaluates `aEventType = Null`, then selects among the source constants with a `case` statement. Each recognized number assigns its literal code; the `else` branch assigns `Null`. There is no database query, normalization or configurable aliasing.

**Behaviour and edge cases**

- Event type `0` is valid and maps to `ReceiveCompany`. Do not use truthiness or zero as a missing-value test.
- With Delphi's default loose `NullEqualityRule`, `Null` follows the explicit null branch and returns `Null`. The rule is process-global; strict or error semantics can alter or break that comparison.
- The intended input is an integral event constant. Avoid relying on Variant coercion from numeric strings, floating-point values, booleans or other families.
- An unknown integer returns `Null`, not an exception or a synthesized label.
- Arrays, interfaces and other incompatible Variant values can raise comparison or ordinal-conversion exceptions, which propagate.
- The numeric ranges communicate grouping but are not calculated. Only the explicitly listed values exist.

**Side effects, errors and performance**

For a supported numeric value the function is pure, constant-time and performs no I/O. It reads no customer configuration. Delphi Variant errors can propagate; they are not caught.

**Related entries**

- [`GetEventTypeNum`](GetEventTypeNum.md) performs the reverse code lookup.
- [Embarcadero: `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.NullEqualityRule)
- [Free Pascal: `NullEqualityRule`](https://www.freepascal.org/docs-html/rtl/variants/nullequalityrule.html)

<small>Created 2026-07-15</small>
