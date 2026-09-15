---
title: "High"
description: "Returns the upper index or supported integer-type maximum for a required argument omitted from the generated declaration."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - bounds
  - arrays
---

```Delphi
// Generated Code Library declaration:
function High: Int64;

// Effective call contract:
function High(X): Int64;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := High('Velox'); // 5
end;
```

### Usage

**Parameters**

| Name | Type | Description |
|---|---|---|
| `X` | supported value | Dynamic/static array, string or supported integer value whose value type/range is inspected. |

Pass a value or variable. Unlike Velox's intrinsic syntax, this function is not documented to accept a bare type identifier such as `High(Integer)`.

**Returns**

| Runtime argument type | Result |
|---|---|
| Dynamic array | `Length(X) - 1`; `-1` when empty |
| Static array | declared start offset plus element count minus one |
| String | `Length(X)`; `0` when empty |
| `Byte` / `ShortInt` | `255` / `127` |
| `Word` / `SmallInt` | `65535` / `32767` |
| `Cardinal` / `Integer` | `4294967295` / `2147483647` |
| `Int64` | `9223372036854775807` |
| `UInt64` | `-1` because the unsigned maximum is written unchecked into the declared `Int64` slot |

### Additional Technical Info
`High` returns the upper index of a supported array/string value or the maximum value for one of the supported integer storage types.

The generated declaration is incomplete: the compiler adds a required untyped argument named `X` after creating the displayed declaration. This runtime helper is narrower than Delphi's compiler intrinsic. The example is fictional and source-reviewed only.

**Implementation**

1. The compiler adds the synthetic input parameter to the declaration.
2. Runtime `High_` resolves its type with `NewTPSVariantIFC`.
3. Arrays/strings use runtime length/type metadata; integer branches use the host type constants.
4. A matching signed/unsigned stack setter writes into the declared `Int64` result slot.
5. Unsupported base types return failure and become a script call/type error.

**Edge cases and differences from Delphi**

- Empty dynamic arrays return `-1`; empty strings return `0` because Velox strings are one-based (`Low(String)=1`).
- `High(UInt64)` puts the unsigned all-bits-one value into the declared `Int64` return slot. `PascalScript.inc` disables range checks, so the bit pattern is interpreted as signed `-1` rather than raising or returning `18446744073709551615`.
- Characters, enumerations, sets, Variants, objects and pointers are not branches in `High_`. Enumerations therefore do not get their declared last member.
- The value of a numeric argument is irrelevant; only its PascalScript base type selects the constant.
- Dynamic array length is inspected at call time. A concurrent mutation of shared array storage is not synchronized.
- The Delphi reference describes a broader intrinsic whose result type follows its argument. Velox instead fixes the public return to `Int64`.

**Side effects**

The function does not mutate `X`, but ordinary argument expressions are evaluated before the call.

**Related entries**

- [`Low`](Low.md) returns the corresponding lower index/type limit.
- [`MaxIntValue`](MaxIntValue.md) examines actual values in an Integer array rather than a type boundary.

**External references**

- [Free Pascal: `System.High`](https://www.freepascal.org/docs-html/rtl/system/high.html)
- [Embarcadero DocWiki: `System.High`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.High)

<small>Created 2026-07-15</small>
