---
title: "Locals"
description: "Exposes the action-owned, case-insensitive named TvxVariableList shared with action scripts and linked child flows."
sidebar_position: 11
slug: /Variables/Locals/Locals
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - locals
  - action-state
---

```Delphi
Locals: TvxVariableList
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Locals['BatchReference'].AsString := 'EXAMPLE';
  Value := Locals['BatchReference'].AsString;
end;
```

### Usage

`Locals` exposes the action-owned, case-insensitive named TvxVariableList shared with action scripts and linked child flows.

**Access and creation**

`Locals['Code']` returns a live [`TvxVariable`](../../Classes/Config/TvxVariable.md). Its typed views simplify known contracts; `Value` exposes the Variant. Lookup uses `AnsiCompareText`, so case differences select the same entry. Looking up a misspelt/new name creates state instead of raising.

API action setup can populate Locals from request query fields through `SetLocals(TStrings)`, assigning each value through `AsString`. Do not assume that presence in Locals proves decoding, validation, authentication or authorisation.

**Sharing with child flows**

`ExecuteFlow` and subaction paths assign the parent's variable-list contents to the child. The code treats those variables as parent-owned: subaction cleanup closes datasets but deliberately avoids nulling the values, then the child clears its borrowed list after execution. Child changes can therefore be visible to the parent and retry timing matters.

### Additional Technical Info
`Locals` exposes the current `TvxActionMan.FLocals` list. It provides named variables shared by scripts operating in that action context.

| Property | Detail |
|---|---|
| Owner | Current `TvxActionMan` |
| Lookup | Case-insensitive default `Variable[Code]` property |
| Missing code | Creates a `TvxVariable` with initial `Null` Value |
| Normal cleanup | Closes variable datasets, then nulls values while retaining entries |
| Child-flow transfer | Parent variable objects are assigned into the child list and cleared from the child after execution |

**Cleanup, ownership and memory**

- The action creates and ultimately frees its Locals list.
- Normal non-subaction cleanup calls `CloseData` and `NullAllVariables`; names/objects remain so pooled/reused actions can reuse them.
- Dynamic codes can accumulate objects even though values are nulled. Prefer a fixed contract.
- `RemoveVariable` and `FreeAllVariables` free objects and can invalidate references held by other scripts/borrowed child lists. Avoid them in ordinary flow logic.
- Dataset values are closed during cleanup; retaining their fields/cursors is unsafe.

**Concurrency and safety**

List search/create and individual variable get/set paths use locks, but multi-step read/modify/write is not atomic. Locals are action coordination state, not a lock, queue or transaction. Do not store secrets or cross-tenant state, pass mutable references asynchronously, or rely on a value surviving cleanup/restart.

**Related entries**

- [`TvxVariableList`](../../Classes/Config/TvxVariableList.md) documents list operations.
- [`TvxVariable`](../../Classes/Config/TvxVariable.md) documents typed views and optional dataset state.
- [`Local1`](Local1.md) through [`Local10`](Local10.md) are separate scripter-field Variants.
- [`Locals`](../Locals.md) compares both local-state models.

**External references**

- [Embarcadero: Variant Types (Delphi)](https://docwiki.embarcadero.com/RADStudio/Athens/en/Variant_Types_%28Delphi%29) explains `Null` and runtime conversion behaviour.
- [Free Pascal Reference Guide: Variant types](https://www.freepascal.org/docs-html/current/ref/ref.html) provides compatibility context; Velox uses Delphi.

<small>Created 2026-07-15</small>
