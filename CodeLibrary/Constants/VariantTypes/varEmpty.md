---
title: varEmpty
description: Identifies the Unassigned or cleared Variant state, which remains distinct even though many conversions yield default values.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, empty, unassigned]
---

```Delphi
varEmpty = 0
```

### Example

```Delphi
function IsUnassignedValue(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varEmpty;
end;
```

### Usage

`varEmpty` identifies the Unassigned or cleared Variant state, which remains distinct even though many conversions yield default values.

### Additional Technical Info
`varEmpty` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0000`. It identifies an uninitialised or cleared Variant, including the value returned by [`Unassigned`](../Variant/Unassigned.md).

This is a state, not empty text, numeric zero, `False`, [`varNull`](varNull.md), a nil interface or COM's missing optional-parameter Error value. Current Delphi conversions commonly turn Empty into `''`, zero or false, but that converted result no longer preserves the original state.

Use [`VarIsEmpty`](../../Functions/Variant/VarIsEmpty.md) when the semantic question is “is this Unassigned?” and [`VarType`](../../Functions/Variant/VarType.md) when the raw representation matters. Delphi's state predicates resolve the special by-reference Variant wrapper before comparing, while `VarType` returns the top-level raw tag.

Assigning `Unassigned` clears the destination and releases any string, array or interface payload it previously owned. Reading an Empty Variant in arithmetic or a strongly typed assignment can silently apply a default or raise depending on the operation; technical mappings should choose an explicit default/error policy before conversion.

Masking is normally harmless, although a canonical Empty value has no array/reference flags. Do not manufacture flag combinations with zero.

The example is source-reviewed only; no Variant was cleared or converted.

**External references**

- [Embarcadero `Unassigned`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.Unassigned)
- [Embarcadero `VarIsEmpty`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarIsEmpty)
- [Free Pascal `varEmpty`](https://www.freepascal.org/docs-html/rtl/system/varempty.html)

<small>Created 2026-07-15</small>
