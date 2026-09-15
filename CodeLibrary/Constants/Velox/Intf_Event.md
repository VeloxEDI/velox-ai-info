---
title: Intf_Event
description: Identifies the Event operational reference interface by fixed Interface.Num value 39 for scripts, database references and numeric tags.
sidebar_position: 320
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - interface
  - operational-reference
  - identifier
  - constant
---

```Delphi
Intf_Event = 39
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA_Interface['Num'].AsInteger = Intf_Event then
    Value := Intf_Event_String;
end;
```

### Usage

`Intf_Event` identifies the Event operational reference interface by fixed Interface.Num value 39 for scripts, database references and numeric tags.

#### Value

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `39` |
| Database row | `Interface.Num = 39` |
| Interface code | `Event` |
| Module row | No (`IsModule = 0`) |
| Fresh-build default | `Active = 0`; `IsConfigured = 0` |

### Additional Technical Info
`Intf_Event` is the script-visible `LongInt` identifier for the Event operational reference interface. Its fixed value is `39`, paired with exact code `Event` in the `Interface` table.

The name identifies an interface category. It does not by itself expose Event records, select a database operation, execute a module, authenticate a caller or grant permissions.

#### Implementation

The native constant in `vxVeloxEDI.pas`, the PascalScript `LongInt` registration in `uPSI_vxVeloxEDI.pas`, the `gVeloxConstMap` entry and the fresh-build database row all use value 39.

Configuration processed by `ProcessVeloxTags` can replace `<!Intf_Event!>` with decimal text `39`. This tag feature reads the in-memory dictionary; it does not query the `Interface` table.

#### Behaviour

- Constant access returns an immutable number without loading or validating current database state.
- Use it only where a consumer explicitly accepts an interface number or `InterfaceNum`.
- Numeric tag expansion emits an unquoted number suitable for the surrounding configuration syntax when that syntax expects one.
- [`Intf_Event_String`](./Intf_Event_String.md) is a separately registered String code, not a runtime conversion result.

#### Edge cases and quirks

- The current seed row is inactive, unconfigured and not a module. The identifier does not enable the Event category or prove that related data exists.
- A generic interface key does not establish the accepted operation. Verify the target function, field, relationship or query before passing 39.
- Category identity is not authorization. In particular, an identifier named Application, User, Setting, Mapping, Event or Issue does not bypass the product's normal permissions and validation paths.
- Database state can change independently of the compiled executable; query `Interface` when current state matters.
- The source/import/tag/database definitions are maintained in parallel. Treat disagreement as mixed product/data versions.
- The String partner is not a numeric tag, and numeric tags are available only for names explicitly entered in `gVeloxConstMap`.

#### Side effects

Reading or comparing the constant has no side effects. Downstream operations retain their own database, audit, security and transaction effects.

#### Errors

The constant cannot fail. A consumer can reject a reference-interface key, fail to find the deployed row or deny the requested operation. An unknown `<!...!>` tag raises an invalid-tag exception.

#### Performance and concurrency

Constant access and in-memory tag lookup are constant-time and thread-safe. Explicit database checks observe mutable shared state and should use the transaction/consistency guarantees required by the operation.

#### Remarks

Prefer the named constant over literal `39`. It preserves category intent while making clear that the number belongs to the Interface key space.

#### Related entries

- [`Intf_Event_String`](./Intf_Event_String.md) — exact String code for this category.
- [`DATA_Interface`](../../Variables/Data/DATA_Interface.md) — dataset for explicit interface-row queries.
- [`ProcessTags`](../../Functions/String/ProcessTags.md) — expands the supported numeric tag.

#### External references

No Delphi or Free Pascal equivalent applies. This identifier and its database meaning are Velox-owned.

<small>Created 2026-07-15</small>
