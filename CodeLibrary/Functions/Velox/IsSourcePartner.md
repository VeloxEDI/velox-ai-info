---
title: "IsSourcePartner"
description: "Returns true for every source number except Velox's internal App value 1."
sidebar_position: 59
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - source
  - partner
  - security
---

```Delphi
Function IsSourcePartner(const aSourceNum : integer) : boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsSourcePartner(2); // True: EDI
end;
```

### Usage

`IsSourcePartner` returns true for every source number except Velox's internal App value 1.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aSourceNum` | `integer`, `const` | Source number to classify. |
| Result | `boolean` | `False` only for `1`; `True` for all other integers. |

**Behaviour and security boundary**

- `True` means “not explicitly internal,” not “recognized partner source.” This distinction is material for validation, routing and audit logic.
- Invalid values intentionally fall into the more restrictive external/partner side. This deliberately applies the more restrictive external treatment to every value other than the known internal value.
- If the caller must reject invalid sources, first use [`GetSourceCode`](GetSourceCode.md) and test for `Null`, then classify the validated number.
- A source number alone does not authenticate a partner, channel or caller. Apply the execution context's authorization and integrity controls.
- Future source values return `True` unless Velox explicitly classifies them as internal.

### Additional Technical Info
`IsSourcePartner` is the exact negation of [`IsSourceInternal`](IsSourceInternal.md). It returns `False` only for source `1` (`App`) and returns `True` for every other integer.

This deliberately conservative classifier treats unknown or invalid sources as partner/external. It is not a validator for the recognized partner-source set.

**Source classification**

| Value | Canonical source | Result |
|---:|---|---|
| `1` | `App` | `False` |
| `2` | `EDI` | `True` |
| `3` | `Web` | `True` |
| `4` | `API` | `True` |
| `0`, negative or any other value | invalid/unknown | `True` |

**Implementation**

The function returns `not IsSourceInternal(aSourceNum)`. The internal helper tests only equality with `1`; there is no range/membership check, database query or source-code conversion.

**Side effects, errors and performance**

The function is pure, constant-time and performs no I/O. Every integer has a defined Boolean result.

**Related entries**

- [`IsSourceInternal`](IsSourceInternal.md) is the predicate being negated.
- [`GetSourceCode`](GetSourceCode.md) and [`GetSourceNum`](GetSourceNum.md) provide the recognized four-value mapping.

<small>Created 2026-07-15</small>
