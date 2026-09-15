---
title: Type_GateIn_String
description: Provides the exact GateIn container-movement code paired with Type_GateIn for Velox container records.
sidebar_position: 510
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
Type_GateIn_String = 'GateIn'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Type_GateIn_String; // 'GateIn'
end;
```

### Usage

`Type_GateIn_String` provides the exact GateIn container-movement code paired with Type_GateIn for Velox container records.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `GateIn` |
| Paired number | [`Type_GateIn`](./Type_GateIn.md) = `1` |
| Database domain | `ContainerMove_Type.Num` / `.Code` |
| Data field | `ContainerMove.MovementTypeNum` |

### Additional Technical Info
`Type_GateIn_String` is the exact script-visible `String` code for the **Gate In** container-movement type. Its value is `GateIn`, paired with [`Type_GateIn`](./Type_GateIn.md) value `1`.

It identifies a movement type only. It does not create a `ContainerMove`, record a physical gate event, validate a container or trigger a workflow.

**Implementation**

Velox declares and registers the exact code `GateIn`. No container-movement type converter is registered, and the String name is not in the tag map.

Fresh-build VxData inserts application-1 `ContainerMove_Type` row `1` with Code `GateIn` and Description `Gate In`; `ContainerMove.MovementTypeNum` references the identity-keyed table.

**Behaviour**

Use the numeric value only when the target deployment retains the seeded row identity. Use the exact code only where caller logic or database lookup explicitly expects it; there is no fixed script converter.

**Edge cases and quirks**

- `ContainerMove_Type.Num` is an identity key and the table is application-scoped/extensible. The constant matches the fresh-build insertion order, not every conceivable migrated or independently populated database.
- The code has no space (`GateIn`/`GateOut`), while the seeded Description contains a space.
- The String identifier is not a tag-map entry.
- Reading a type does not prove that a container crossed a gate or that an event row exists.
- PascalScript retains no movement-type domain after the integer/string is evaluated; values 1 and 2 overlap other families.

**Side effects**

Reading `Type_GateIn_String`, comparing it has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Persisting a number that does not identify a row in the target deployment can fail the `MovementTypeNum` foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access is constant-time; database identity and movement concurrency belong to caller operations.

**Remarks**

The example is source-reviewed and non-destructive. It does not create or process a container movement.

**Related entries**

- [`Type_GateIn`](./Type_GateIn.md) is the paired numeric identifier.

<small>Created 2026-07-15</small>
