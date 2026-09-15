---
title: Type_GateIn
description: Identifies the Gate In container-movement type as fresh-build ContainerMove_Type.Num value 1.
sidebar_position: 509
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
Type_GateIn = 1
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Type_GateIn; // 1
end;
```

### Usage

`Type_GateIn` identifies the Gate In container-movement type as fresh-build ContainerMove_Type.Num value 1.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `1` |
| Paired text | [`Type_GateIn_String`](./Type_GateIn_String.md) = `GateIn` |
| Database domain | `ContainerMove_Type.Num` / `.Code` |
| Data field | `ContainerMove.MovementTypeNum` |

### Additional Technical Info
`Type_GateIn` is the script-visible `LongInt` identifier for the **Gate In** container-movement type. Its fixed value is `1`, paired with [`Type_GateIn_String`](./Type_GateIn_String.md).

It identifies a movement type only. It does not create a `ContainerMove`, record a physical gate event, validate a container or trigger a workflow.

**Implementation**

Velox declares and registers fixed value `1`. The numeric name is in the Velox tag map, so `<!Type_GateIn!>` expands to `1`. No container-movement type converter is registered.

Fresh-build VxData inserts application-1 `ContainerMove_Type` row `1` with Code `GateIn` and Description `Gate In`; `ContainerMove.MovementTypeNum` references the identity-keyed table.

**Behaviour**

Use the numeric value only when the target deployment retains the seeded row identity. Use the exact code only where caller logic or database lookup explicitly expects it; there is no fixed script converter.

**Edge cases and quirks**

- `ContainerMove_Type.Num` is an identity key and the table is application-scoped/extensible. The constant matches the fresh-build insertion order, not every conceivable migrated or independently populated database.
- The code has no space (`GateIn`/`GateOut`), while the seeded Description contains a space.
- The tag expansion produces the number `1`, not the code `GateIn`.
- Reading a type does not prove that a container crossed a gate or that an event row exists.
- PascalScript retains no movement-type domain after the integer/string is evaluated; values 1 and 2 overlap other families.

**Side effects**

Reading `Type_GateIn`, comparing it, or expanding its tag has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Persisting a number that does not identify a row in the target deployment can fail the `MovementTypeNum` foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access is constant-time; database identity and movement concurrency belong to caller operations.

**Remarks**

The example is source-reviewed and non-destructive. It does not create or process a container movement.

**Related entries**

- [`Type_GateIn_String`](./Type_GateIn_String.md) is the paired movement code.

<small>Created 2026-07-15</small>
