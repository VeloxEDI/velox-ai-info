---
title: Delete
description: Deletes mapping-data rows for one input value while retaining the mapping definition and reporting no-op deletion as success.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, delete, database]
---

```Delphi
function Delete(const aInValue: string): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var TestMap: TvxMappingItem;
begin
  // Run only in a governed non-production configuration task.
  TestMap := Mappings['DOC_EXAMPLE_STATUS'];
  Value := TestMap.Delete('ObsoleteCode');
end;
```

### Usage

Deletes mapping-data rows for one input value while retaining the mapping definition and reporting no-op deletion as success.

**Parameter**

`aInValue` is matched against `[Mapping_Data].[InValue]` using the system database's collation. Velox quotes it with `SafeSQL`, removing NUL characters and doubling apostrophes.

**Returns**

The result starts as True. It remains True when MapNum is zero, when no row matches, or when the delete statement succeeds. It becomes False only when a caught database exception occurs. The method does not inspect affected-row count.

### Additional Technical Info
`Delete` removes all `[Mapping_Data]` rows matching this item's numeric mapping identity and the supplied input value.

**Behaviour and side effects**

When MapNum is nonzero, the method synchronously executes:

```SQL
DELETE FROM [Mapping_Data]
WHERE MappingNum = <current MapNum> AND InValue = <quoted input>
```

The mapping definition in `[Mapping]`, cached Code/metadata and other inputs are unchanged. A later [`GetOutValue`](GetOutValue.md) for the deleted input normally returns an empty string.

**Edge cases and quirks**

- A zero MapNum is a silent no-op success; Delete does not create or validate a map.
- A nonzero but stale MapNum can also return True while deleting nothing.
- Database collation determines case and accent sensitivity, so the matched input may not be byte-for-byte identical to the argument.
- There is no item/list lock. Lookup/Add/Delete operations from other threads can interleave; a row can be recreated immediately after deletion.
- Database exceptions are logged with the misleading text "error creating Mapping_Data table entry", then swallowed and returned as False.
- This permanently changes shared configuration data. Do not call it in normal record processing or use a True result as evidence that a row previously existed.

`Delete` does not invalidate the process-global mapping item because value pairs are queried live rather than cached. Use [`TvxMappingList.RemoveMap`](../../TvxMappingList/Methods/RemoveMap.md) only when definition metadata itself must be reloaded.

<small>Created 2026-07-15</small>
