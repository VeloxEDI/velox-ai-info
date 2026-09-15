---
title: Variable
description: Returns a case-insensitive cached variable by Code, lazily creating and initialising one while holding the list lock.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, default-property, lazy-cache]
---

```Delphi
property Variable[aCode: string]: TvxVariable read; default;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var WorkVar: TvxVariable;
begin
  WorkVar := Locals.Variable['BatchReference'];
  Value := WorkVar.Value;
end;
```

### Usage

Returns the variable identified by `Code`, using a case-insensitive match. The first request loads the variable; later requests with the same code return the same value until it is removed or all variables are cleared.

**Lookup sequence**

1. Locks the list.
2. Scans cached items linearly and compares Code with `AnsiCompareText`.
3. Returns the first hit without refreshing Value.
4. On a miss, creates `TvxVariable.Create(nil)`, sets its Code to the exact argument, invokes `GetValue(aCode)`, assigns the returned Variant and caches it.
5. Unlocks and returns the borrowed list-owned object.

Normal base-list creation yields Null. Settings queries the system database; AzureSecrets can perform OAuth/HTTP/JSON work. All initial acquisition is inside the list lock. Errors behave according to the item: caught failures may still result in a cached Null/zero item.

### Additional Technical Info
`Variable` is the read-only default property of `TvxVariableList`.

These forms are equivalent:

```Delphi
WorkVar := Locals.Variable['BatchReference'];
WorkVar := Locals['BatchReference'];
```

**Quirks and concurrency**

- Blank/whitespace Codes are accepted and cached.
- Cache lookup is case-insensitive and O(entry count); exact first-request case remains on the object.
- A hit does not re-run GetValue. Null/failure and successful source snapshots persist until invalidation/owner cleanup.
- The returned object is never owned by the script. The list unlocks before its use; RemoveVariable, FreeAllVariables or owner destruction can invalidate it concurrently.
- A variable setter can change Code after insertion, disrupting later lookup and creating duplicates; the list does not re-key entries.

For repeated access within a controlled execution, holding the borrowed variable can avoid linear lookup, but never retain it across owner cleanup or cache-management calls.

<small>Created 2026-07-15</small>
