---
title: "Assigned"
description: "Tests whether a supported scalar, string, array, class or interface value is nonzero, nonempty or non-nil."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - assigned
  - nil
---

```Delphi
function Assigned(I: LongInt): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Region: string;
begin
  Region := 'NZ';
  Value := Assigned(Region) and not Assigned('');
end;
```

### Usage

`Assigned` tests whether a supported scalar, string, array, class or interface value is nonzero, nonempty or non-nil.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `I` | supported value | Scalar, string, array, object or interface value to test. Only the categories listed below are supported. |

**Returns**

`True` when the value is assigned according to its runtime category; otherwise `False`.

| Runtime category | `False` when | `True` when |
|---|---|---|
| 8-, 16- or 32-bit signed/unsigned integer | Numeric value is zero | Numeric value is nonzero |
| Narrow string or PChar-like string | Length is zero | String is nonempty |
| Wide or Unicode string | Length is zero | String is nonempty |
| Dynamic array | Array pointer is `nil` | Array pointer is non-`nil`, including an allocated zero-length array |
| Class instance | Object reference is `nil` | Object reference is non-`nil` |
| Interface | Interface reference is `nil` | Interface reference is non-`nil` |

**Errors**

An unsupported value type raises an error instead of returning `False`. Use only the supported categories above or a type-appropriate test.

**Usage notes**

Use [`IsNullorEmpty`](IsNullorEmpty.md) for the documented Velox classification of `Variant` values. Use explicit array bounds, dataset state or object-specific properties when "assigned" is weaker than the condition the flow actually requires.

### Additional Technical Info
`Assigned` tests whether a value in one of the supported runtime categories is nonzero, nonempty or non-`nil`. Although the generated declaration appears to accept `LongInt`, the PascalScript compiler recognises this call specially and passes the actual argument type to the runtime operation.

The example is source-reviewed and is not executed by the documentation workflow.

The nominal `LongInt` parameter is an implementation placeholder, not the complete callable type contract. Do not use it to conclude that every value is converted to `LongInt`.

**Implementation**

The modified PascalScript compiler maps the identifier to an internal `!ASSIGNED` operation and compiles the actual argument without applying the public declaration's `LongInt` conversion. The runtime examines the resulting PascalScript base type and performs the category-specific test above.

This is not a call to Delphi `System.Assigned`. The name is compatible, but the shipped PascalScript runtime provides its own implementation and supported-type matrix.

**Edge cases and quirks**

- Floating-point values, `Variant`, 64-bit integer types and other unlisted runtime types are not handled by the current operation. Passing one can fail the runtime call instead of returning a Boolean.
- An allocated dynamic array with no elements has a non-`nil` array pointer and can be reported as assigned. Test its bounds or length when the business rule is "contains an item".
- A non-`nil` class or interface reference says only that a reference exists. It does not prove that the referenced resource is open, connected or otherwise usable.
- A whitespace-only string is assigned because it is not empty. Apply `Trim` first if whitespace-only text is considered absent.
- The misleading `LongInt` signature is a generator/compiler surface quirk. It should not be copied into a type-conversion strategy.

**Side effects**

None. The operation reads the supplied value and does not acquire, release or mutate the referenced object.

**Performance and concurrency**

The test is constant-time for supported values and uses no shared mutable state. String checks read stored length information rather than scanning the contents.

**Related entries**

- [`Comparison`](../Comparison.md) compares the available value-testing families.
- [`IsNullorEmpty`](IsNullorEmpty.md) distinguishes Null, Empty, clear, string, numeric and conversion paths for a `Variant`.
- [`Testing values`](../../ScriptingGuide/TestingValues.md) explains common Velox value states.

**External references**

- [Embarcadero `System.Assigned`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Assigned) — Delphi context only; Velox uses the different PascalScript operation documented here.
- [Free Pascal `Assigned`](https://www.freepascal.org/docs-html/rtl/system/assigned.html) — compatibility context for pointer-like values, not Velox's supported-type matrix.

<small>Created 2026-07-15</small>
