---
title: "Low"
description: "Returns the lower index or supported integer-type minimum for a required argument omitted from the generated declaration."
sidebar_position: 9
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
function Low: Int64;

// Effective call contract:
function Low(X): Int64;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Low('Velox'); // 1
end;
```

### Usage

**Parameters**

| Name | Type | Description |
|---|---|---|
| `X` | supported value | Dynamic/static array, string or supported integer value whose value type/range is inspected. |

Pass a value or variable. A bare type identifier is not part of the verified external-call contract.

**Returns**

| Runtime argument type | Result |
|---|---|
| Dynamic array | `0`, including an empty array |
| Static array | its declared start offset |
| String | `1`, including an empty string |
| `Byte`, `Word`, `Cardinal`, `UInt64` | `0` |
| `ShortInt` | `-128` |
| `SmallInt` | `-32768` |
| `Integer` | `-2147483648` |
| `Int64` | `-9223372036854775808` |

### Additional Technical Info
`Low` returns the lower index of a supported array/string value or the minimum value for a supported integer storage type.

The generated declaration is incomplete: the compiler adds a required untyped argument named `X` after creating the displayed declaration. This external runtime helper is narrower than Delphi's compiler intrinsic. The example is fictional and source-reviewed only.

**Implementation**

1. The compiler adds the synthetic input parameter.
2. Runtime `Low_` resolves the parameter's PascalScript type.
3. Arrays/strings return hard-coded/index metadata; integer branches return host type constants.
4. The result is written to the declared `Int64` return slot.
5. Unsupported types return failure and become a script call/type error.

**Edge cases and differences from Delphi**

- An empty dynamic array has `Low=0` and `High=-1`; an empty string has `Low=1` and `High=0`. A loop guarded only by `Low` is therefore unsafe for empties.
- Characters, enumerations, sets, Variants, objects and pointers are not supported branches. `Low` does not return an enumeration's first declared member.
- The value of a numeric argument is ignored; only its base type matters.
- Delphi's intrinsic supports more type-identifier and ordinal forms and can return the argument/index type. Velox fixes the return to `Int64`.
- Static arrays can have a non-zero or negative declared start offset; the runtime preserves that offset.

**Side effects**

The function does not mutate `X`, though the argument expression itself is evaluated normally.

**Related entries**

- [`High`](High.md) returns the corresponding upper index/type boundary.
- [`MinIntValue`](MinIntValue.md) examines actual elements rather than a type minimum.

**External references**

- [Free Pascal: `System.Low`](https://www.freepascal.org/docs-html/rtl/system/low.html)
- [Embarcadero DocWiki: `System.Low`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Low)

<small>Created 2026-07-15</small>
