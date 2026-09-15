---
title: "CheckBoolean"
description: "Converts a Variant to Boolean through Velox's null-handling wrapper."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - variant
  - boolean
  - "null"
---

```Delphi
Function CheckBoolean( const aBooleanValue : variant) : boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Enabled: variant;
begin
  Enabled := True;
  Value := CheckBoolean(Enabled);
end;
```

### Usage

Use `CheckBoolean` when a `Variant` from controlled Velox data is expected to contain a Boolean or a value Velox can safely convert to Boolean. It is useful for normalising a known Boolean-shaped value before a condition or assignment.

Do not use it as a general parser for partner text such as `yes`, `no`, `on` or `off`. Normalise those values explicitly. When `Null` must deterministically mean `False`, test for `Null` first rather than relying on this function's direct Variant comparison; invalid or incompatible values can raise an exception instead of returning `False`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aBooleanValue` | `Variant`, `const` | Value to compare with `Null` and, when that branch is not taken, coerce to `Boolean`. |

**Returns**

The converted Boolean value. The intended null branch returns `False`, but its direct Variant equality is subject to the runtime's Null comparison rules.

### Additional Technical Info

`CheckBoolean` passes a `Variant` through Velox's Boolean wrapper. The wrapper attempts to treat a value that compares equal to `Null` as `False`; otherwise it assigns the `Variant` to a Boolean result and lets Delphi perform the conversion.

The example uses an already-Boolean Variant. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript import calls the Velox implementation directly. Its complete decision is equivalent to:

```Delphi
if aBooleanValue = Null then
  Result := False
else
  Result := aBooleanValue;
```

This is not a string parser and does not contain a table of accepted textual Boolean values. The second assignment invokes Delphi's Variant-to-Boolean conversion.

**Behaviour**

Boolean inputs return their existing value. Compatible numeric or text Variant values may be converted by Delphi; incompatible values raise a Variant conversion exception. The exact Null comparison and conversion behaviour can also be influenced by Delphi's process-wide Variant rules.

**Edge cases and quirks**

- The implementation uses `aBooleanValue = Null`, not `VarIsNull(aBooleanValue)`. Direct Variant equality with `Null` is governed by the installed Delphi runtime's `NullEqualityRule`; it should not be treated as an unconditional, type-only Null test.
- If the equality result does not select the intended branch, assigning a Null Variant to Boolean can raise an invalid-null or type-conversion exception depending on runtime configuration.
- `Empty`, an empty string, whitespace, zero and `False` are not explicitly classified. Any result for them comes from Variant comparison/conversion rather than a Velox business rule.
- Do not assume arbitrary words such as `yes`, `no`, `on` or `off` are accepted. Normalise external text explicitly before calling this function.
- Variant arrays, interfaces, dates, custom variants and values that cannot convert to Boolean can raise rather than returning `False`.

**Side effects**

The function does not mutate the supplied Variant. Variant comparison and conversion use process-wide runtime rules but the function itself changes no global setting.

**Errors**

Delphi can raise Variant type-cast, invalid-operation or invalid-null exceptions during the equality or Boolean conversion. The function does not catch or translate them.

**Performance and concurrency**

The wrapper performs one Variant comparison and, normally, one conversion. It is otherwise constant-time and re-entrant. Results can depend on process-wide Variant settings changed elsewhere in the host.

**Remarks**

Use `VarIsNull` before conversion when Null must deterministically mean `False`, and define explicit handling for `Empty` and strings from external systems. [`IsNullorEmpty`](IsNullorEmpty.md) provides an explicit type-predicate path for absence testing, but it does not convert a present value to Boolean.

**Related entries**

- [`IsNullorEmpty`](IsNullorEmpty.md) explicitly tests Null, Empty and clear Variants before other conversions.
- [`IsNullorZero`](IsNullorZero.md) is another Velox wrapper that uses direct Variant equality.
- [`Testing values`](../../ScriptingGuide/TestingValues.md) explains safe Variant-state checks.

**External references**

- [Embarcadero `System.Variants.Null`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.Null)
- [Embarcadero Variant support routines](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants)
- [Free Pascal `VarIsNull`](https://www.freepascal.org/docs-html/rtl/variants/varisnull.html) — useful type-predicate context; Velox is governed by Delphi's shipped Variant runtime.

<small>Created 2026-07-15</small>
