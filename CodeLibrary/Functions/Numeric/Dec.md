---
title: "Dec"
description: "Decrements a supported integer variable by exactly one through PascalScript's synthetic var parameter."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - decrement
  - mutation
---

```Delphi
// Generated Code Library declaration:
procedure Dec;

// Effective call contract:
procedure Dec(var X);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Counter: Integer;
begin
  Counter := 5;
  Dec(Counter);
  Value := Counter; // 4
end;
```

### Usage

Decrements a supported integer variable by exactly one through Velox scripting's synthetic var parameter.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `X` | supported integer variable, `var` | Value changed in place. It must be assignable storage, not a literal or calculated expression. |

Supported runtime storage types are `Byte`, `ShortInt`, `Word`, `SmallInt`, `Cardinal`, `Integer`, `Int64` and `UInt64`. The effective parameter is untyped at script declaration, so unsupported types can compile but fail at runtime.

**Boundary behaviour and quirks**

- Only a step of one is available. `Dec(X, N)` is part of Velox but not this script declaration.
- `Velox scripting.inc` explicitly compiles this runtime with range and overflow checks off, overriding the enclosing project setting. Every supported fixed-width type wraps at its boundary: for example, `Dec(Byte(0))` becomes `255`, `Dec(Low(Integer))` becomes `High(Integer)`, and `Dec(UInt64(0))` becomes `High(UInt64)`.
- The `Cardinal` branch passes through signed `SetInt`, but unchecked conversions preserve the low 32-bit pattern; valid high Cardinal values are not rejected.
- Enumerations have a distinct Velox scripting `btEnum` base type and are not handled, despite Velox's broader ordinal contract.
- A `Variant` is not handled. Use [`GetAndInc`](GetAndInc.md) only for its specific increment-and-return Variant use case; there is no matching decrement helper.

### Additional Technical Info
`Dec` subtracts exactly one from a mutable PascalScript integer variable. The generated declaration is incomplete: the compiler adds a required untyped `var X` parameter after creating the displayed declaration.

This is a PascalScript runtime helper, not Delphi's full intrinsic contract. It has no second decrement-amount argument and does not support pointers, characters, enumerations or Variants through this registered path. The example is fictional and source-reviewed only.

**Implementation**

1. The compiler adds the synthetic in/out parameter to the nominally parameterless declaration.
2. Runtime `Dec_` resolves the parameter by reference with `NewTPSVariantIFC(..., True)`.
3. It switches on the exact PascalScript base type, subtracts one and writes through a type-specific stack setter.
4. An unsupported base type returns failure, which the script runtime reports as a call/type error.

This external helper is separate from the `cm_dec` bytecode used internally to advance a `for..downto` loop counter.

**Side effects and concurrency**

`X` is mutated in place. The operation has no lock or atomic interlocked semantics. Do not use it as a synchronization primitive for Globals shared by concurrent executions. Check the boundary explicitly if wraparound is not intended.

**External references**

- [Free Pascal: `System.Dec`](https://www.freepascal.org/docs-html/rtl/system/dec.html)
- [Embarcadero DocWiki: `System.Dec`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Dec)

<small>Created 2026-07-15</small>
