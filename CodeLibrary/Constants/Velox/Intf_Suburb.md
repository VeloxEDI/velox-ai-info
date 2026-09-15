---
title: Intf_Suburb
description: Identifies the Suburb reference interface by its fixed Interface.Num value 26 for scripts, database references and Velox numeric tags.
sidebar_position: 358
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
Intf_Suburb = 26
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Interface['Num'].AsInteger = Intf_Suburb then
    Value := Intf_Suburb_String;
end;
```

### Usage

`Intf_Suburb` identifies the Suburb reference interface by its fixed Interface.Num value 26 for scripts, database references and Velox numeric tags.

#### Value

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `26` |
| Database row | `Interface.Num = 26` |
| Interface code | `Suburb` |
| Module row | No (`IsModule = 0`) |
| Fresh-build default | `Active = 0`; `IsConfigured = 0` |

### Additional Technical Info
`Intf_Suburb` is the script-visible `LongInt` identifier for the Suburb reference interface. Its fixed value is `26`, the current `Interface.Num` primary key paired with code `Suburb`.

Use it where Velox explicitly expects an interface number or `InterfaceNum`. It identifies a reference-data category; it does not execute a module or load that category's records.

#### Implementation

`vxVeloxEDI.pas` declares this value, `uPSI_vxVeloxEDI.pas` registers it as a PascalScript `LongInt`, and the fresh-build database seeds the same key/code pair.

`InitVeloxConstMap` also inserts `Intf_Suburb` into the case-insensitive numeric tag dictionary. Configuration processed by `ProcessVeloxTags` can therefore replace `<!Intf_Suburb!>` with the unquoted decimal text `26`.

#### Behaviour

- Reading the compile-time constant performs no database query, category lookup or validation.
- It can be compared with `DATA_Interface['Num']` or used for a field/function that explicitly accepts an interface key.
- Numeric tag replacement is configuration processing, not script-constant evaluation.
- [`Intf_Suburb_String`](./Intf_Suburb_String.md) is a separate String registration; Velox does not convert the pair dynamically.

#### Edge cases and quirks

- The row is seeded as inactive, unconfigured and not a module. The constant does not make the Suburb category available or prove that any corresponding reference rows exist.
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

Prefer `Intf_Suburb` over the literal `26`. The name preserves the reference-category meaning and avoids confusing this key with unrelated identifiers that reuse the same number.

#### Related entries

- [`Intf_Suburb_String`](./Intf_Suburb_String.md) — exact String code for this interface.
- [`DATA_Interface`](../../Variables/Data/DATA_Interface.md) — dataset for explicit interface-row queries.
- [`ProcessTags`](../../Functions/String/ProcessTags.md) — expands the supported numeric tag name.

#### External references

No Delphi or Free Pascal equivalent applies. This identifier and its database meaning are Velox-owned.

<small>Created 2026-07-15</small>
