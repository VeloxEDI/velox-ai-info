---
title: Type_GateOut_String
description: Provides the exact GateOut container-movement code paired with Type_GateOut for Velox container records.
sidebar_position: 512
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - container-movement
  - string-constant
---

```Delphi
Type_GateOut_String = 'GateOut'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Type_GateOut_String; // 'GateOut'
end;
```

### Usage

`Type_GateOut_String` provides the exact GateOut container-movement code paired with Type_GateOut for Velox container records.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `GateOut` |
| Paired number | [`Type_GateOut`](./Type_GateOut.md) = `2` |
| Database domain | `ContainerMove_Type.Num` / `.Code` |
| Data field | `ContainerMove.MovementTypeNum` |

### Additional Technical Info
`Type_GateOut_String` is the exact script-visible `String` code for the **Gate Out** container-movement type. Its value is `GateOut`, paired with [`Type_GateOut`](./Type_GateOut.md) value `2`.

It identifies a movement type only. It does not create a `ContainerMove`, record a physical gate event, validate a container or trigger a workflow.

**Implementation**

Velox declares and registers the exact code `GateOut`. No container-movement type converter is registered, and the String name is not in the tag map.

Fresh-build VxData inserts application-1 `ContainerMove_Type` row `2` with Code `GateOut` and Description `Gate Out`; `ContainerMove.MovementTypeNum` references the identity-keyed table.

**Behaviour**

Use the numeric value only when the target deployment retains the seeded row identity. Use the exact code only where caller logic or database lookup explicitly expects it; there is no fixed script converter.

**Edge cases and quirks**

- `ContainerMove_Type.Num` is an identity key and the table is application-scoped/extensible. The constant matches the fresh-build insertion order, not every conceivable migrated or independently populated database.
- The code has no space (`GateIn`/`GateOut`), while the seeded Description contains a space.
- The String identifier is not a tag-map entry.
- Reading a type does not prove that a container crossed a gate or that an event row exists.
- PascalScript retains no movement-type domain after the integer/string is evaluated; values 1 and 2 overlap other families.

**Side effects**

Reading `Type_GateOut_String`, comparing it has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Persisting a number that does not identify a row in the target deployment can fail the `MovementTypeNum` foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access is constant-time; database identity and movement concurrency belong to caller operations.

**Remarks**

The example is source-reviewed and non-destructive. It does not create or process a container movement.

**Related entries**

- [`Type_GateOut`](./Type_GateOut.md) is the paired numeric identifier.

<small>Created 2026-07-15</small>
