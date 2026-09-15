---
title: "Globals"
description: "Exposes the process-wide, case-insensitive named TvxVariableList singleton."
sidebar_position: 11
slug: /Variables/Globals/Globals
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - globals
  - process-state
---

```Delphi
Globals: TvxVariableList
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Access creates the named entry with Null if it does not exist. }
  Globals['ExampleReference'].AsString := 'EXAMPLE';
  Value := Globals['ExampleReference'].AsString;
end;
```

### Usage

`Globals` exposes the process-wide, case-insensitive named TvxVariableList singleton.

**Access and stored values**

`Globals['Code']` returns a live [`TvxVariable`](../../Classes/Config/TvxVariable.md). Use its typed views (`AsString`, `AsInteger`, `AsFloat`, `AsDateTime`, `AsBoolean` and others documented by the class) when the value contract is known, or `Value` for the Variant.

Looking up a missing code is not a read-only operation: `TvxVariableList.GetVariable` creates and retains a new object. Codes compare with `AnsiCompareText`, so case differences select the same variable. A typo therefore creates a different entry without reporting an unknown-name error.

**Concurrency and atomicity**

The list locks search/creation/removal and each variable locks individual get/set operations. That does not make a multi-step operation such as read, increment, write an atomic counter; another execution can interleave. Returned `TvxVariable` references can also be invalidated by removal or `FreeAllVariables`.

**Lifecycle and side effects**

- Values survive later action executions only while the same process remains running.
- Restarting a Designer/service process loses the complete list; another worker/server has a different singleton.
- `RemoveVariable(Code)` frees one matching entry. `FreeAllVariables` frees every entry process-wide. Both can disrupt unrelated scripts and must be treated as administrative/destructive operations.
- `CloseData` closes datasets held by variables; `NullAllVariables` exists in product code but is not part of this list's public scripting import.
- The singleton owns its variables. Scripts must not free the list or returned variables.

**Safety guidance**

Do not use `Globals` for tenant-isolated transactions, credentials, personal data, durable workflow state, distributed coordination, sequences, financial totals or exactly-once decisions. Prefer explicit configuration/database storage with permissions, transactions and audit where those properties matter. If disposable process state is justified, use a fixed namespaced key, define type/default/reset rules and tolerate concurrent overwrite and restart loss.

### Additional Technical Info
`Globals` exposes the live unit-level `gGlobals` object. Unlike `Global1` through `Global10`, it is shared across actions, executions and threads in the current Velox process.

| Property | Detail |
|---|---|
| Runtime object | `vxVariables.gGlobals` |
| Lifetime | Created at unit initialisation; freed at process finalisation |
| Lookup | Case-insensitive code through the default `Variable[Code]` property |
| Missing code | Lazily creates a `TvxVariable` whose initial `Value` is `Null` |
| Durability | Memory only; not persisted or shared between processes/servers |

**Related entries**

- [`TvxVariableList`](../../Classes/Config/TvxVariableList.md) documents list operations.
- [`TvxVariable`](../../Classes/Config/TvxVariable.md) documents typed value/data access.
- [`Global1`](Global1.md) through [`Global10`](Global10.md) are action-scoped scratch Variants, not aliases of this list.
- [`Globals`](../Globals.md) compares both scopes.

**External references**

- [Embarcadero: Variant Types (Delphi)](https://docwiki.embarcadero.com/RADStudio/Athens/en/Variant_Types_%28Delphi%29) explains runtime types, `Unassigned`, `Null` and conversion behaviour.
- [Free Pascal Reference Guide: Variant types](https://www.freepascal.org/docs-html/current/ref/ref.html) provides compatibility context; Velox uses Delphi.

<small>Created 2026-07-15</small>
