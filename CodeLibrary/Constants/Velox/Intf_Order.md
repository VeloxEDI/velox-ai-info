---
title: Intf_Order
description: Identifies the Order module by its fixed Interface.Num value 1 for scripts, database references and Velox numeric tags.
sidebar_position: 330
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - interface
  - module
  - identifier
  - constant
---

```Delphi
Intf_Order = 1
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Interface['Num'].AsInteger = Intf_Order then
    Value := Intf_Order_String;
end;
```

### Usage

`Intf_Order` identifies the Order module by its fixed Interface.Num value 1 for scripts, database references and Velox numeric tags.

#### Value

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `1` |
| Database row | `Interface.Num = 1` |
| Interface code | `Order` |
| Module row | Yes (`IsModule = 1`) |
| Fresh-build default | `Active = 1`; `IsConfigured = 0` |

### Additional Technical Info
`Intf_Order` is the script-visible `LongInt` identifier for the Order module interface. Its value is the fixed `Interface.Num` key `1`.

Use the numeric constant where Velox expects an interface key or `InterfaceNum`. Use [`Intf_Order_String`](./Intf_Order_String.md) where an interface code is required.

#### Implementation

Velox declares the native constant in `vxVeloxEDI.pas` and registers the same value with PascalScript through `uPSI_vxVeloxEDI.pas`. The fresh-build `Interface` table seeds row 1 with code `Order`.

`InitVeloxConstMap` also adds the exact name `Intf_Order` and value 1 to the case-insensitive Velox tag dictionary. Consequently, configuration processed by `ProcessVeloxTags` can expand:

```text
<!Intf_Order!>
```

to the decimal text `1`. Tag expansion is a separate configuration feature; reading this script constant does not run tag processing.

#### Behaviour

- The value is a compile-time constant. Reading it performs no database query and does not inspect the current `Interface` row.
- It is suitable for numeric comparisons with `DATA_Interface['Num']`, `InterfaceNum` foreign keys and functions that explicitly accept an interface number.
- The paired String constant is separately registered. Velox does not calculate either member of the pair from the other at runtime.
- Tag lookup is case-insensitive for the name between `<!` and `!>`; replacement emits an unquoted decimal string.

#### Edge cases and quirks

- The constant establishes identity only. It does not prove that the Order module is licensed, enabled, configured, active or valid for the current action.
- A fresh database sets `Active = 1` and `IsConfigured = 0` for this row. Administrators and upgrades can change row state without changing the compiled constant.
- Interface numbers 14-19 are reserved blank rows, so the numeric sequence is intentionally sparse between module interfaces 1-13 and reference interfaces 20 onward.
- The source constants and seed data are maintained in parallel rather than generated dynamically at runtime. Treat a source/database disagreement as a deployment-version problem.
- Numeric tags exist only for names deliberately entered in `gVeloxConstMap`. Do not assume every script constant is a valid Velox tag.

#### Side effects

Reading or comparing the constant has no side effects. Operations that consume it may read or modify data associated with interface 1; their own documentation controls those effects.

#### Errors

The constant itself cannot fail. A database operation can still fail when the corresponding row is absent, inactive, inaccessible or inconsistent with the deployed product version. An unknown `<!...!>` tag causes tag processing to raise an invalid-tag exception rather than leaving the token unchanged.

#### Performance and concurrency

Constant access and tag-dictionary lookup are constant-time operations. The value is immutable and thread-safe. Current database configuration is mutable shared state, so check it explicitly when the operation depends on active/configured status.

#### Remarks

Prefer this named constant over the literal `1`. It preserves the business meaning in scripts and protects the script from accidental renumbering assumptions.

#### Related entries

- [`Intf_Order_String`](./Intf_Order_String.md) — exact String code for the same interface.
- [`DATA_Interface`](../../Variables/Data/DATA_Interface.md) — reusable dataset commonly used to load interface row data.
- [`ProcessTags`](../../Functions/String/ProcessTags.md) — expands supported `<!...!>` numeric tags in configuration text.

#### External references

No Delphi or Free Pascal equivalent applies. This identifier and its database meaning are Velox-owned.

<small>Created 2026-07-15</small>
