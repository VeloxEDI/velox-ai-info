---
title: "GetEventTypeNum"
description: "Converts a Velox event type code to its canonical number."
sidebar_position: 10
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
Function GetEventTypeNum(const aEventTypeCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetEventTypeNum('SendPartner'); // 41
end;
```

### Usage

`GetEventTypeNum` converts a Velox event type code to its canonical number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aEventTypeCode` | `string`, `const` | Event type code. Matching is case-insensitive but otherwise exact. |
| Result | `Variant` | Numeric event type for a recognized code; otherwise `Null`. |

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

**Behaviour and edge cases**

- Matching is ordinal and case-insensitive for these ASCII codes, so `sendpartner` matches `SendPartner`.
- The whole string must match. Leading or trailing whitespace, punctuation changes and embedded spaces return `Null`.
- Empty text and numeric text such as `'41'` return `Null`; the function does not parse numeric input.
- `ReceiveCompany` returns the valid number `0`. Do not interpret a zero result as failure; test `VarIsNull`.
- The result is an integer held in a `Variant`.
- Similar-looking custom event names cannot be added through configuration.

### Additional Technical Info
`GetEventTypeNum` converts a canonical Velox EDI event type code to its source-defined number. It recognizes the complete company, partner, notification and proof-of-delivery mapping below. The table is fixed in product source.

**Implementation**

The function compares the input with every source literal using Delphi `SameText`, in source order, and assigns the first corresponding constant. If no comparison matches, it assigns `Null`. It does not trim, parse a number, query the database or consult configurable event metadata.

**Side effects, errors and performance**

The function is pure for string input, performs no I/O and changes no state. It performs a bounded linear scan of 21 literals, which is effectively constant-time for scripting use. Unknown values return `Null`.

**Related entries**

- [`GetEventTypeCode`](GetEventTypeCode.md) performs the reverse numeric lookup.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
