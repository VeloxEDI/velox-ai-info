---
title: LinkedActionFID
description: Documents the currently unusable scripting declaration for a flow's linked-action TGuid.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - flow
  - known-defect
---

```Delphi
property LinkedActionFID: TGuid read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  ChildFID: TGuid;
begin
  { LinkedActionFID is not runtime-bound in the current product. }
  ChildFID := GetActionFID('Child Flow');
  Value := GUIDToStringNoBraces(ChildFID);
end;
```

### Usage

Do not read or assign `LinkedActionFID` in current Velox scripts because the property cannot be bound when the script executable loads.

For explicit nested execution, resolve the target with [`GetActionFID`](../../../../Functions/Velox/GetActionFID.md) and pass that identifier to [`ExecuteFlow`](../Methods/ExecuteFlow.md). Product-configured linked actions remain a separate flow configuration feature.

**Behaviour**

Do not read or write `Action.LinkedActionFID` in the current Velox version. A script that references this property is expected to fail while loading because the property is unavailable during execution.

Use [`GetActionFID`](../../../../Functions/Velox/GetActionFID.md) to resolve an intended target and pass that identifier directly to [`ExecuteFlow`](../Methods/ExecuteFlow.md) when explicit nested execution is required. Product-configured linked actions remain a separate flow configuration feature.

**Errors**

A script that references this property can compile against the class declaration but fail when Velox binds the compiled script to runtime class helpers. No value-level try/except can make an unbound property reliable.

### Additional Technical Info
`LinkedActionFID` is declared to the script compiler as the read/write `TGuid` identifier used by Velox linked-flow configuration, but the current runtime import does not bind that property name correctly.

**Declared value**

The native field defaults to the empty GUID and is used by the product's configured linked-action loading/saving behaviour.

**Implementation defect**

Compile-time registration declares `LinkedActionFID`. The matching runtime getter and setter exist, but runtime registration mistakenly registers them under the name `Actions`. A later registration adds the real indexed `Actions` getter under that same name, and the PascalScript importer resolves the newest matching class item first.

Consequently, `Actions[Index]` has its intended current getter, while no runtime helper is registered under `LinkedActionFID`.

**Edge cases and quirks**

- This is a product registration defect, not an invalid GUID value or permissions failure.
- The generated Code Library page remains accurate as a declaration inventory but must carry this runtime warning until the import is fixed.
- Correcting `_Index.json` or the Markdown cannot repair runtime binding; the product import name must change.
- Do not use the accidental `Actions` registration as a GUID back door; the real indexed registration shadows it.

**Related entries**

- [`Actions`](Actions.md) — effective indexed action-item property despite the duplicate runtime name.
- [`ExecuteFlow`](../Methods/ExecuteFlow.md) — supported explicit nested-flow call.
- [`GetActionFID`](../../../../Functions/Velox/GetActionFID.md) — resolves a named flow safely.
- [`TGUID`](../../../../Types/DataTypes/TGUID.md) — declared identifier type.

<small>Created 2026-07-15</small>
