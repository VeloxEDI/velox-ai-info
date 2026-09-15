---
title: Intf_Product
description: Identifies the Product reference interface by its fixed Interface.Num value 22 for scripts, database references and Velox numeric tags.
sidebar_position: 344
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - interface
  - reference-data
  - identifier
  - constant
---

```Delphi
Intf_Product = 22
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Interface['Num'].AsInteger = Intf_Product then
    Value := Intf_Product_String;
end;
```

### Usage

`Intf_Product` identifies the Product reference interface by its fixed Interface.Num value 22 for scripts, database references and Velox numeric tags.

#### Value

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `22` |
| Database row | `Interface.Num = 22` |
| Interface code | `Product` |
| Module row | No (`IsModule = 0`) |
| Fresh-build default | `Active = 0`; `IsConfigured = 0` |

### Additional Technical Info
`Intf_Product` is the script-visible `LongInt` identifier for the Product reference interface. Its fixed value is `22`, the current `Interface.Num` primary key paired with code `Product`.

Use it where Velox explicitly expects an interface number or `InterfaceNum`. It identifies a reference-data category; it does not execute a module or load that category's records.

#### Implementation

`vxVeloxEDI.pas` declares this value, `uPSI_vxVeloxEDI.pas` registers it as a PascalScript `LongInt`, and the fresh-build database seeds the same key/code pair.

`InitVeloxConstMap` also inserts `Intf_Product` into the case-insensitive numeric tag dictionary. Configuration processed by `ProcessVeloxTags` can therefore replace `<!Intf_Product!>` with the unquoted decimal text `22`.

#### Behaviour

- Reading the compile-time constant performs no database query, category lookup or validation.
- It can be compared with `DATA_Interface['Num']` or used for a field/function that explicitly accepts an interface key.
- Numeric tag replacement is configuration processing, not script-constant evaluation.
- [`Intf_Product_String`](./Intf_Product_String.md) is a separate String registration; Velox does not convert the pair dynamically.

#### Edge cases and quirks

- The row is seeded as inactive, unconfigured and not a module. The constant does not make the Product category available or prove that any corresponding reference rows exist.
- `IsModule = 0` is material: do not pass this identifier to an API merely because that API accepts a module interface number. Confirm the consumer accepts reference-interface keys.
- Deployed database state can change independently of the executable. Check `Interface` when behavior depends on current `Active` or `IsConfigured` values.
- Interface keys 14-19 are blank reserved rows; valid named reference identifiers resume at 20.
- Source constants, importer registrations, tag-map values and database seeds are maintained in parallel. A mismatch indicates mixed deployment versions, not a conversion rule.
- Numeric tags exist only for explicitly mapped numeric names. The String partner is not a valid `<!...!>` tag.

#### Side effects

Reading or comparing the constant has no side effects. A downstream lookup or data operation has the effects, permissions and transaction behavior of that operation.

#### Errors

The constant cannot fail. Consumers can fail when the deployed interface row is missing, inaccessible, inactive or not accepted for that operation. An unknown numeric tag name raises an invalid-tag exception.

#### Performance and concurrency

Constant access and tag lookup are constant-time and thread-safe. Database configuration and category data remain mutable shared state and may require an explicit query/transaction for a consistent decision.

#### Remarks

Prefer `Intf_Product` over the literal `22`. The name preserves the reference-category meaning and avoids confusing this key with unrelated identifiers that reuse the same number.

#### Related entries

- [`Intf_Product_String`](./Intf_Product_String.md) — exact String code for this interface.
- [`DATA_Interface`](../../Variables/Data/DATA_Interface.md) — dataset for explicit interface-row queries.
- [`ProcessTags`](../../Functions/String/ProcessTags.md) — expands the supported numeric tag name.

#### External references

No Delphi or Free Pascal equivalent applies. This identifier and its database meaning are Velox-owned.

<small>Created 2026-07-15</small>
