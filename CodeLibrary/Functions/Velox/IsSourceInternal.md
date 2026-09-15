---
title: "IsSourceInternal"
description: "Returns true only for Velox's internal App source number 1."
sidebar_position: 58
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - source
  - internal
  - classification
---

```Delphi
Function IsSourceInternal(const aSourceNum : integer) : boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsSourceInternal(1); // True: App
end;
```

### Usage

`IsSourceInternal` returns true only for Velox's internal App source number 1.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aSourceNum` | `integer`, `const` | Source number to classify. |
| Result | `boolean` | `True` only when `aSourceNum = 1`; otherwise `False`. |

**Behaviour and security boundary**

- A `False` result means only “not the App constant”; it does not prove that the value is a valid external source.
- Zero, negative and future/unknown source numbers all return `False`.
- The source number is metadata, not authentication. Do not grant trust merely because a value equals `1` unless the surrounding Velox flow has established and protected that value.
- Use [`GetSourceCode`](GetSourceCode.md) and test for `Null` if validity as one of the current four source constants matters.
- [`IsSourcePartner`](IsSourcePartner.md) is the exact complement and consequently returns `True` for invalid numbers.

### Additional Technical Info
`IsSourceInternal` reports whether a numeric source is exactly Velox source `1` (`App`). Every other integer returns `False`, including all recognized external sources and invalid values.

**Source classification**

| Value | Canonical source | Result |
|---:|---|---|
| `1` | `App` | `True` |
| `2` | `EDI` | `False` |
| `3` | `Web` | `False` |
| `4` | `API` | `False` |
| any other integer | invalid/unknown | `False` |

**Implementation**

The imported function is one exact expression: `Result := (aSourceNum = 1)`. It does not call `GetSourceCode`, inspect request/session state or consult configuration.

**Side effects, errors and performance**

The function is pure, constant-time and performs no I/O. Every integer has a defined Boolean result.

**Related entries**

- [`IsSourcePartner`](IsSourcePartner.md) negates this result.
- [`GetSourceCode`](GetSourceCode.md) and [`GetSourceNum`](GetSourceNum.md) provide the validated four-value mapping.

<small>Created 2026-07-15</small>
