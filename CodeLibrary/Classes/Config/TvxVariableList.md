---
title: TvxVariableList
description: Owns a thread-protected lazy cache of named variables used by Globals, Locals, Settings and AzureSecrets.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variables, cache, concurrency]
---

```Delphi
TvxVariableList = class(TvxThreadList)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var WorkVar: TvxVariable;
begin
  WorkVar := Locals['BatchReference'];
  WorkVar.AsString := 'EXAMPLE';
  Value := WorkVar.AsString;
end;
```

### Usage

`TvxVariableList` provides named variables used by Globals, Locals, Settings and AzureSecrets. A variable is loaded when its code is first requested and remains available until it is removed or all variables are cleared.

**Ownership and invalidation**

[`RemoveVariable`](TvxVariableList/Methods/RemoveVariable.md) removes matching entries; [`FreeAllVariables`](TvxVariableList/Methods/FreeAllVariables.md) removes all entries. Either operation also makes any associated dataset unavailable.

Do not retain a variable or its dataset across these operations, and never clear shared variables during ordinary record processing.

Code matching is case-insensitive. Repeated access does not refresh the source value; remove the variable first when a reload is required.

### Additional Technical Info
`TvxVariableList` owns a lazy case-insensitive cache of [`TvxVariable`](TvxVariable.md) objects. It is the script-visible class used by Globals, Locals, Settings and inherited by AzureSecrets; each host determines the list's scope and initial-value source.

Scripts do not construct or free these lists. Globals and Settings are process singletons, AzureSecrets is process-global, and Locals belongs to the current action context.

**Lazy lookup**

The default [`Variable`](TvxVariableList/Properties/Variable.md) property locks the list and linearly searches cached Code values using `AnsiCompareText`. A miss creates an unowned variable, preserves the exact requested Code, calls the class's virtual initial-value hook, caches the object and unlocks.

Base lists initialise a missing value to Null. Settings performs synchronous system-database I/O and AzureSecrets can authenticate/call Key Vault. Those descendant operations run while the list lock remains held, so one slow miss blocks every lookup/invalidation on that list.

Missing and failed values are cached. Source updates or transient recovery are not observed automatically. Explicit removal/all-clear forces later lazy acquisition.

<small>Created 2026-07-15</small>
