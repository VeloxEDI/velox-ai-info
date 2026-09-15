---
title: "Inc"
description: "Increments a supported integer variable by exactly one through PascalScript's synthetic var parameter."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - increment
  - mutation
---

```Delphi
// Generated Code Library declaration:
procedure Inc;

// Effective call contract:
procedure Inc(var X);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Counter: Integer;
begin
  Counter := 5;
  Inc(Counter);
  Value := Counter; // 6
end;
```

### Usage

Increments a supported integer variable by exactly one through Velox scripting's synthetic var parameter.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `X` | supported integer variable, `var` | Value changed in place. It must be assignable storage, not a literal or calculated expression. |

Supported runtime storage types are `Byte`, `ShortInt`, `Word`, `SmallInt`, `Cardinal`, `Integer`, `Int64` and `UInt64`. Unsupported untyped arguments can compile but fail when the value type switch is executed.

**Boundary behaviour and quirks**

- Only a step of one is available. Velox's `Inc(X, N)` overload is not available.
- `Velox scripting.inc` explicitly compiles this runtime with range and overflow checks off, overriding the enclosing project setting. Every supported fixed-width type wraps at its boundary: `Inc(High(Byte))` becomes `0`, `Inc(High(Integer))` becomes `Low(Integer)`, and `Inc(High(UInt64))` becomes `0`.
- The `Cardinal` branch passes through signed `SetInt`, but unchecked conversions preserve the low 32-bit pattern; values above `High(Integer)` remain usable until the Cardinal itself wraps.
- `btEnum`, `Char` and `Variant` are absent from the runtime switch. Do not infer Velox's wider ordinal support from the name.

### Additional Technical Info
`Inc` adds exactly one to a mutable PascalScript integer variable. The generated declaration is incomplete: the compiler adds a required untyped `var X` parameter after creating the displayed declaration.

This is a PascalScript runtime helper, not Delphi's full intrinsic contract. It has no second increment-amount argument and does not support pointers, characters, enumerations or Variants through this registered path. The example is fictional and source-reviewed only.

**Implementation**

1. The compiler adds the synthetic in/out parameter.
2. Runtime `Inc_` resolves that parameter by reference.
3. It switches on the exact integer base type, adds one and writes through a type-specific stack setter.
4. Any unhandled base type returns failure, which PascalScript reports as a call/type error.

This external helper is separate from the `cm_inc` bytecode which the compiler emits internally for a `for` loop counter.

**Concurrency and side effects**

`X` is mutated in place without a lock or interlocked instruction. It is unsuitable as a concurrency-safe shared counter. Check the boundary explicitly when wraparound is not intended.

**Related entries**

- [`Dec`](Dec.md) subtracts one using the corresponding runtime helper.
- [`GetAndInc`](GetAndInc.md) returns a Variant's previous Integer value and then mutates it, also without atomicity.

**External references**

- [Free Pascal: `System.Inc`](https://www.freepascal.org/docs-html/rtl/system/inc.html)
- [Embarcadero DocWiki: `System.Inc`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Inc)

<small>Created 2026-07-15</small>
