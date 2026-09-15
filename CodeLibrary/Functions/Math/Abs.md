---
title: "Abs"
description: "Returns the non-negative magnitude of an Extended floating-point value by clearing its sign."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mathematics
  - absolute-value
  - floating-point
---

```Delphi
function Abs(E: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Abs(-125.75); // 125.75
end;
```

### Usage

`Abs` returns the non-negative magnitude of an Extended floating-point value by clearing its sign.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `E` | `Extended` | Floating-point value whose sign is to be removed. Integer arguments are converted to `Extended` for this declaration. |

**Returns**

The same floating-point magnitude as `E`, with the sign cleared. The return type remains `Extended`; this entry does not return an integer and does not round the value.

### Additional Technical Info
`Abs` returns the magnitude of an `Extended` value. Negative finite input becomes positive, while positive input and positive zero are unchanged.

This is the PascalScript standard function, not a Velox-specific numeric helper. The example is fictional and source-reviewed only.

**Implementation**

1. The modified PascalScript compiler declares `Abs` in its standard Math group.
2. At runtime, standard-procedure selector 22 reads the argument through `Stack.GetReal`.
3. It calls Delphi's intrinsic `System.Abs` and writes the resulting real value to the PascalScript stack.

There is no Velox validation, conversion to `Variant`, configuration access or flow-state change.

**Edge cases and quirks**

- `Abs(-0.0)` is positive zero because the Delphi floating-point implementation clears the sign bit.
- Positive and negative infinity both produce positive infinity.
- A NaN remains a NaN. Clearing the sign can change its sign bit, but does not make it a number or make equality comparisons useful.
- The overload visible to Velox accepts `Extended`. It is different from Delphi's integer overloads, so integer minimum-value overflow associated with fixed-width integer absolute value does not apply here.
- `Extended` precision follows the host Delphi target. In targets where `Extended` aliases `Double`, retaining the `Extended` name does not add 80-bit precision.

**Errors and side effects**

The operation is pure and normally does not raise for finite values, infinities or a quiet NaN. A signalling NaN or a non-default floating-point environment can still produce a hardware floating-point exception. Velox does not catch or translate such an exception in this wrapper.

**Related entries**

- [`Sqrt`](Sqrt.md) returns a principal square root rather than merely removing a sign.
- [`Int`](Int.md) removes a fractional part by rounding toward zero.

**External references**

- [Free Pascal: `System.Abs`](https://www.freepascal.org/docs-html/rtl/system/abs.html)
- [Embarcadero DocWiki: `System.Abs`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Abs)

<small>Created 2026-07-15</small>
