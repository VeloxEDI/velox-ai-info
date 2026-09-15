---
title: TvxVariableGroup
description: Represents a host-owned cached global variable group exposed to scripts under its dynamically generated V_ identifier.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable-group, globals, cache]
---

```Delphi
TvxVariableGroup = class
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Replace V_MyGroup with a configured group identifier.
  if V_MyGroup <> nil then
    Value := V_MyGroup.VariableCount
  else
    Value := 0;
end;
```

### Usage

`TvxVariableGroup` represents a Velox-provided cached global variable group exposed to scripts under its dynamically generated V_ identifier.

**Security and concurrency**

Variables can contain shared operational values or encrypted-at-rest secrets that are decrypted by their value accessors. Do not log/export values without classification and authorisation. Avoid read-modify-write sequences that assume isolation; another execution can change a variable between calls.

### Additional Technical Info
`TvxVariableGroup` is a configured module containing process-global [`TvxVariable`](../Config/TvxVariable.md) objects. Velox caches groups and makes each one available to scripts under a generated global identifier.

**Acquisition and naming**

There is no fixed `VariableGroup` variable and no script constructor. A non-default group identifier is formed as:

```text
V_ + ModuleName with spaces removed
```

For example, a module named `My Group` is registered as `V_MyGroup`. The default group uses `V_Variables`. Pascal identifiers are case-insensitive, but setup must still produce a valid, unique identifier; punctuation and other invalid characters are not removed by this naming step.

Velox registers/binds every cached group while preparing a scripter. A group that is missing from the cache at that time is not a declared identifier for that compiled script.

**Script-visible members**

- [`VariableByCode`](TvxVariableGroup/Properties/VariableByCode.md) performs a case-insensitive lookup and is the default indexed property.
- [`VariableCount`](TvxVariableGroup/Properties/VariableCount.md) returns the current child count.
- [`Variables`](TvxVariableGroup/Properties/Variables.md) returns a child by zero-based index.

All returned variables are live host-owned objects, not copies. Their values can be shared by unrelated actions/threads. A direct variable-value assignment changes cached runtime state but does not itself invoke the group module's SaveModule operation.

**Cache and lifetime**

Groups load from configuration into a process-global cache. Saving/deleting a group, switching mode or explicitly clearing the cache can remove and free a cached object, then load a replacement. Never free a group/variable or retain its reference outside current use.

Each accessor locks the group only while locating/counting a child. The lock has ended when it returns the object. A count followed by an index access is not one atomic operation, and host structural changes/cache replacement can invalidate assumptions or references.

**Tag access**

Variable-group tags use:

```text
<*GroupName.VariableCode*>
```

Tag processing adds `V_` internally, loads/resolves the group and variable, and replaces all case-insensitive tag occurrences with the variable's `AsString`. A missing group or variable raises an exception. Script indexed access instead returns nil for a missing code.

<small>Created 2026-07-15</small>
