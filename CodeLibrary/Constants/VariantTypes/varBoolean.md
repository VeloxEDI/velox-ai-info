---
title: varBoolean
description: Identifies a Variant Boolean stored with Delphi and Automation's 16-bit WordBool representation.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, boolean, wordbool]
---

```Delphi
varBoolean = 11
```

### Example

```Delphi
function HasBooleanType(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varBoolean;
end;
```

### Usage

`varBoolean` identifies a Variant Boolean stored with Velox and Automation's 16-bit WordBool representation.

### Additional Technical Info
`varBoolean` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$000B` for a Variant Boolean. Delphi's underlying field is `WordBool`, compatible with Automation `VARIANT_BOOL`: false is zero and canonical true is all bits set (`-1` when interpreted as signed 16-bit).

Script code should use Boolean expressions and conversions rather than reading or depending on that physical bit pattern. In particular, treating the payload as an ordinary integer `1` is not a portable representation test. [`VarType`](../../Functions/Variant/VarType.md) inspects the tag without converting the value.

**Conversion behavior**

- Assigning `True` or `False` to a Variant normally creates this type.
- [`VarAsType`](../../Functions/Variant/VarAsType.md) can request `varBoolean`; supported source text/numbers are converted under Delphi Variant rules and invalid values can raise a conversion exception.
- Boolean-to-string output is affected by Delphi's process-global Boolean conversion settings; use an explicit business format when an integration requires `Y/N`, `1/0` or another contract.
- Null and Empty require separate policy. A type-code test must not be replaced by truthiness.

The code can be combined with [`varArray`](varArray.md) or [`varByRef`](varByRef.md). Mask to test the base type, then handle the flag and lifetime separately. Inspection is constant-time and performs no I/O; conversion can allocate or raise.

The example is source-reviewed only; no Variant conversion was executed.

**External references**

- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Embarcadero `TVarType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TVarType)
- [Free Pascal `varBoolean`](https://www.freepascal.org/docs-html/rtl/system/varboolean.html)

<small>Created 2026-07-15</small>
