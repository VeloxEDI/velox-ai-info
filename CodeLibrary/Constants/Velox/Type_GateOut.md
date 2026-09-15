---
title: Type_GateOut
description: Identifies the Gate Out container-movement type as fresh-build ContainerMove_Type.Num value 2.
sidebar_position: 511
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - container-movement
  - constant
---

```Delphi
Type_GateOut = 2
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Type_GateOut; // 2
end;
```

### Usage

`Type_GateOut` identifies the Gate Out container-movement type as fresh-build ContainerMove_Type.Num value 2.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Paired text | [`Type_GateOut_String`](./Type_GateOut_String.md) = `GateOut` |
| Database domain | `ContainerMove_Type.Num` / `.Code` |
| Data field | `ContainerMove.MovementTypeNum` |

### Additional Technical Info
`Type_GateOut` is the script-visible `LongInt` identifier for the **Gate Out** container-movement type. Its fixed value is `2`, paired with [`Type_GateOut_String`](./Type_GateOut_String.md).

It identifies a movement type only. It does not create a `ContainerMove`, record a physical gate event, validate a container or trigger a workflow.

**Implementation**

Velox declares and registers fixed value `2`. The numeric name is in the Velox tag map, so `<!Type_GateOut!>` expands to `2`. No container-movement type converter is registered.

Fresh-build VxData inserts application-1 `ContainerMove_Type` row `2` with Code `GateOut` and Description `Gate Out`; `ContainerMove.MovementTypeNum` references the identity-keyed table.

**Behaviour**

Use the numeric value only when the target deployment retains the seeded row identity. Use the exact code only where caller logic or database lookup explicitly expects it; there is no fixed script converter.

**Edge cases and quirks**

- `ContainerMove_Type.Num` is an identity key and the table is application-scoped/extensible. The constant matches the fresh-build insertion order, not every conceivable migrated or independently populated database.
- The code has no space (`GateIn`/`GateOut`), while the seeded Description contains a space.
- The tag expansion produces the number `2`, not the code `GateOut`.
- Reading a type does not prove that a container crossed a gate or that an event row exists.
- PascalScript retains no movement-type domain after the integer/string is evaluated; values 1 and 2 overlap other families.

**Side effects**

Reading `Type_GateOut`, comparing it, or expanding its tag has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Persisting a number that does not identify a row in the target deployment can fail the `MovementTypeNum` foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access is constant-time; database identity and movement concurrency belong to caller operations.

**Remarks**

The example is source-reviewed and non-destructive. It does not create or process a container movement.

**Related entries**

- [`Type_GateOut_String`](./Type_GateOut_String.md) is the paired movement code.

<small>Created 2026-07-15</small>
