---
title: "GetAndInc"
description: "Returns a Variant variable's current Integer value and then replaces the variable with that value plus one."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - variant
  - mutation
---

```Delphi
function GetAndInc(var aValue: variant): integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Global1 := 41;
  Value := GetAndInc(Global1); // Value = 41; Global1 = 42
end;
```

### Usage

`GetAndInc` returns a Variant variable's current Integer value and then replaces the variable with that value plus one.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Variant`, `var` | Assignable Variant storage. On success it is replaced with `aValue + 1`. |

**Returns**

The pre-increment value converted to a 32-bit `Integer`.

### Additional Technical Info
`GetAndInc` implements a post-increment-like operation for a `Variant` variable: it first converts/copies the current value into a 32-bit `Integer` result, then evaluates Variant addition by one and stores that new Variant back into the same variable.

It was intended for variables such as `Global1`. It is a normal read/modify/write sequence, not an atomic counter primitive. The example is fictional and source-reviewed only.

**Implementation order**

```Delphi
Result := aValue;
aValue := aValue + 1;
```

The order matters:

1. Delphi Variant-to-Integer conversion happens first.
2. If that conversion fails or is out of range, the increment statement is not reached and `aValue` remains unchanged.
3. If conversion succeeds, Variant `+` is evaluated.
4. The resulting Variant is assigned back; a failure in addition/assignment propagates after the result calculation but before the function returns normally.

**Accepted values and quirks**

- Ordinary integral numeric Variants within the 32-bit range are the intended input.
- Floating and numeric-text Variants are subject to Delphi Variant conversion/rounding rules when assigned to the Integer result; do not assume truncation.
- `Null`, error Variants, arrays, objects and nonnumeric text can raise conversion/operator errors. Process-global Variant settings can affect Null/conversion behaviour.
- The stored post-increment Variant type follows Delphi Variant arithmetic and need not be identical to the original subtype.
- A starting value at or near an integer/Variant subtype limit can overflow, promote or raise according to the actual subtype and runtime settings.
- The `var` parameter requires a variable. A literal, property-like expression or calculated expression cannot be used as the mutation target.

**Concurrency and side effects**

The supplied variable is mutated. No lock protects the read/convert/add/write sequence, so concurrent use of the same Global can lose increments. Use flow design or an external transactional/locking mechanism when uniqueness matters.

This helper does not persist a counter, log the change or coordinate between Velox processes.

**Related entries**

- [`Inc`](Inc.md) increments supported typed integer storage but does not return the previous value and does not accept a Variant through its registered path.
- [`Dec`](Dec.md) decrements supported typed integer storage.

**External references**

- [Embarcadero: Variant Types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Variant_Types_%28Delphi%29)
- [Free Pascal: `Variants` unit](https://www.freepascal.org/docs-html/rtl/variants/index.html)

<small>Created 2026-07-15</small>
