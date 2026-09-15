---
title: Add
description: Creates the mapping definition if necessary and conditionally inserts one input/output pair without updating an existing input.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, insert, database]
---

```Delphi
function Add(const aInValue, aOutValue: string): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var TestMap: TvxMappingItem;
begin
  // Run only in a governed non-production configuration task.
  TestMap := Mappings['DOC_EXAMPLE_STATUS'];
  Value := TestMap.Add('N', 'New');
end;
```

### Usage

`Add` creates the mapping definition if necessary and conditionally inserts one input/output pair without updating an existing input.

**Parameters**

- `aInValue` is the input key stored in `[Mapping_Data].[InValue]`. Together with MapNum it forms the table's primary key.
- `aOutValue` is the output text stored in `[Mapping_Data].[OutValue]`.

**Returns**

Returns True when the SQL statement completes, including when the input already exists and no row is inserted. Returns False when automatic map creation fails or a caught database exception occurs. It does not report affected-row count.

### Additional Technical Info
`Add` ensures the cached mapping has a database definition and then conditionally inserts one mapping-data row.

**Implementation**

1. If [`MapNum`](../Properties/MapNum.md) is zero, calls [`CreateMap('', '')`](CreateMap.md). Failure exits with False.
2. Executes one SQL Server statement: `IF NOT EXISTS` for the `(MapNum, InValue)` pair, followed by `INSERT` only when absent.
3. Quotes both string values with `SafeSQL`; NUL characters are removed and apostrophes doubled.
4. Executes synchronously through the Velox system connection. On completion it returns True.

**Edge cases and quirks**

- Add is insert-only. An existing input keeps its original OutValue but the method still returns True. Delete it first if an intentional replacement is required.
- Automatic creation uses blank SyncURL and Description. Those cached/database fields are not subsequently populated by Add.
- Input/output columns are NVARCHAR(255). Over-length values can cause a logged database failure and False.
- SQL equality and uniqueness follow database collation. A case-insensitive database commonly treats case-only input variants as the same key.
- `IF NOT EXISTS` is not protected by an item/list lock or an explicit serializable transaction. Concurrent calls can both observe absence; the primary key then rejects one insert, which is caught and returned as False.
- This is persistent configuration mutation, not an in-memory cache addition. It can block on the database and should not be repeated per record when the mapping is static.

Caught exceptions are logged as a generic Mapping_Data creation warning and are not re-raised. Do not interpret False as proof that no row exists: automatic map creation or another concurrent caller may already have committed changes.

<small>Created 2026-07-15</small>
