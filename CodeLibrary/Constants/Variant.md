---
title: Variant
description: "Special Variant values for explicit Null and the Unassigned or cleared state, with their different tests and conversion rules."
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, constants, variant, 'null', unassigned, empty, missing]
---

## Available values

| Value | Variant type | Meaning |
|---|---|---|
| [`Null`](Variant/Null.md) | [`varNull`](VariantTypes/varNull.md) | Explicit missing/unknown data, commonly corresponding to database `NULL`. |
| [`Unassigned`](Variant/Unassigned.md) | [`varEmpty`](VariantTypes/varEmpty.md) | Uninitialized or deliberately cleared Variant state. |

These are values, not predicates or text literals. `Null` is not the empty string, numeric zero, Boolean false, JSON `null`, a null object reference or `Unassigned`. `Unassigned` is not a promise that a business field is optional.

## Test before conversion

Use [`VarIsNull`](../Functions/Variant/VarIsNull.md) and [`VarIsEmpty`](../Functions/Variant/VarIsEmpty.md) to distinguish the states. Do not rely on `Value = Null`: Variant comparisons involving Null follow Delphi's process-global `NullEqualityRule` and `NullMagnitudeRule`, can yield Null rather than Boolean, and can raise when a Boolean is required.

Assigning `Unassigned` clears a destination Variant and releases any managed string, array or interface it previously owned. Reading either constant creates/returns the corresponding Variant state without database I/O. Conversion is a separate operation and can return defaults or raise depending on destination type and the process-global conversion rules.

When passing optional COM/Automation arguments, do not assume either value is the missing-parameter sentinel. That convention normally uses a [`varError`](VariantTypes/varError.md) value carrying `DISP_E_PARAMNOTFOUND`; the exact imported API must document support.

For dataset fields, prefer the field's null APIs and inspect its concrete type. For JSON, create/inspect the JSON node kind rather than treating a Variant Null as a serialized JSON token automatically.

**External references**

- [Embarcadero Variant types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Variant_Types_(Delphi))
- [Embarcadero `Null`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.Null)
- [Embarcadero `Unassigned`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.Unassigned)
- [Free Pascal Variants](https://www.freepascal.org/docs-html/rtl/variants/index.html)

<small>Created 2026-07-15</small>
