---
title: RemoveVariable
description: Destroys all cached variables whose Code matches case-insensitively so a later lookup reacquires the value.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, cache-invalidation, refresh]
---

```Delphi
procedure RemoveVariable(const aCode: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Coordinate existing references before targeted invalidation.
  Locals.RemoveVariable('BatchReference');
  Value := True;
end;
```

### Usage

`RemoveVariable` destroys all cached variables whose Code matches case-insensitively so a later lookup reacquires the value.

### Additional Technical Info
`RemoveVariable` locks the list, scans backward and frees every variable whose Code matches `aCode` through `AnsiCompareText`, then packs nil slots.

It returns no status: no cached match and one or more removals are indistinguishable. Comparison is case-insensitive; whitespace is not trimmed. Although the default getter normally prevents duplicate case-insensitive entries, the backward loop removes all matches if they exist.

This is memory invalidation only. It does not delete Settings rows, Key Vault secrets or other external data. A later default-property access creates a new variable and reacquires according to the concrete list: Null for base Globals/Locals, database value for Settings, remote/cached-default-vault logic for AzureSecrets.

Freeing also destroys the variable's lazy dataset. Any previously returned variable/dataset reference becomes dangling, and another script can still be using it outside the list lock. Coordinate targeted invalidation even when only one Code is affected.

Use this to make later source changes visible or retry a negatively cached value, subject to descendant-specific caches: AzureSecrets' separate nonempty default-vault cache is not reset by removing an entry.

<small>Created 2026-07-15</small>
