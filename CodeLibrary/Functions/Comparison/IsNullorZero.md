---
title: "IsNullorZero"
description: "Tests a Variant against Null or numeric zero using Velox's direct comparison wrapper."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - variant
  - "null"
  - zero
---

```Delphi
function IsNullorZero(const aValue: variant): boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsNullorZero(0);
end;
```

### Usage

Use `IsNullorZero` only when a controlled `Variant` is expected to contain an ordinary numeric value and exact zero is the condition of interest.

Do not rely on it for deterministic `Null` handling or as a text parser. Test `VarIsNull` or `VarIsEmpty` explicitly, convert the remaining value to the required numeric type, and use `IsZero` or `IsZeroEpsilon` when floating-point tolerance is needed.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Variant`, `const` | Value compared first with `Null` and, when required, with integer zero. |

**Returns**

The intended result is `True` when either direct Variant comparison is true; otherwise `False`. For ordinary numeric zero/nonzero inputs this is straightforward. Null, text and other Variant types require the qualifications below.

**Behaviour**

Integer and floating Variant zero values normally compare equal to zero; nonzero numeric values normally return `False`. Other types may be coerced by Velox for the comparison or may raise.

Direct equality with Null is governed by Velox's process-wide `NullEqualityRule` and related Variant settings. It is not equivalent to testing `VarIsNull(aValue)`, so the function must not be used where deterministic Null classification is safety-critical without verifying the host settings.

**Errors**

Direct Variant equality can raise type-cast, invalid-operation or invalid-null exceptions. They are not caught or translated.

**Usage notes**

For a robust nullable numeric field, first use `VarIsNull`/`VarIsEmpty` according to the field contract, then convert through an explicit numeric parser and compare with either exact or tolerant zero as appropriate. That sequence makes errors and accepted input types visible.

### Additional Technical Info
`IsNullorZero` returns the result of comparing a `Variant` directly with `Null` or numeric zero. The example uses a numeric Variant and returns `True`; it is source-reviewed and is not executed by the documentation workflow.

This wrapper is concise but does not use the explicit Variant predicates used by [`IsNullorEmpty`](IsNullorEmpty.md). Its Null and coercion behaviour is therefore controlled by Delphi's Variant comparison rules.

**Implementation**

The complete Velox condition is:

```Delphi
(aValue = Null) or (aValue = 0)
```

This condition is inside a native Delphi function, not compiled from the calling PascalScript expression. The Delphi Boolean-evaluation setting used to build Velox determines whether its second comparison is skipped after a true first result. In either case, the first operation itself is a direct Variant equality.

**Edge cases and quirks**

- A Null Variant can produce a result or exception according to Delphi's current Null comparison/conversion rules. The function does not force Null to `True` with `VarIsNull`.
- Numeric-looking strings may be coerced to a number, while other strings can raise a Variant type-cast error. Do not use this as a text parser.
- `Empty`, `False`, dates, custom variants, arrays and interfaces have type-specific coercion/comparison paths. No blanket zero-like guarantee is implemented.
- Floating values very close to zero but not exactly equal do not receive an epsilon. Use [`IsZero`](IsZero.md) or [`IsZeroEpsilon`](IsZeroEpsilon.md) for tolerant floating comparison.
- A `NaN` numeric Variant does not compare equal to zero.
- Because two different comparisons are hidden behind one Boolean, an exception does not identify a business classification; it is a Variant operation failure.

**Side effects**

The wrapper does not mutate the Variant. Custom Variant comparison handlers can execute type-specific code outside the wrapper.

**Performance and concurrency**

Ordinary scalar comparisons are constant-time. The function is re-entrant, but results can depend on process-wide Variant rules and custom Variant handlers.

**Related entries**

- [`IsNullorEmpty`](IsNullorEmpty.md) performs explicit state predicates and treats numeric zero as present.
- [`IsZero`](IsZero.md) uses Delphi's default floating tolerance.
- [`IsZeroEpsilon`](IsZeroEpsilon.md) uses an explicit floating tolerance.
- [`Testing values`](../../ScriptingGuide/TestingValues.md) explains safe Variant checks.

**External references**

- [Embarcadero `System.Variants.Null`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.Null)
- [Embarcadero Variant support routines and global rules](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants)
- [Free Pascal `Null`](https://www.freepascal.org/docs-html/rtl/variants/null.html) — compatibility context only; Velox uses Delphi's Variant runtime and settings.

<small>Created 2026-07-15</small>
