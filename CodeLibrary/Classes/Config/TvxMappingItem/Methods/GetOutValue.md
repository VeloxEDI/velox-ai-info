---
title: GetOutValue
description: Performs a live forward lookup from a mapping's unique input key to its stored output text.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, lookup, database]
---

```Delphi
function GetOutValue(const aInValue: string): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var CountryMap: TvxMappingItem;
begin
  CountryMap := Mappings['CountryCode'];
  if CountryMap.MapNum > 0 then
    Value := CountryMap.GetOutValue('NZ')
  else
    Value := '';
end;
```

### Usage

`GetOutValue` performs a live forward lookup from a mapping's unique input key to its stored output text.

**Parameter**

`aInValue` is quoted with `SafeSQL` and compared against `[Mapping_Data].[InValue]` under the system database's SQL Server collation. NUL characters are removed and apostrophes escaped before SQL execution.

**Returns**

- When [`MapNum`](../Properties/MapNum.md) is zero: literal `Invalid Map - '<Code>' not found.`
- When the input row exists: its OutValue through the database field's `AsString` conversion.
- When no row exists: an empty string.
- On a caught query error: no distinct error value; the managed string result is left at its empty/default value and a warning is logged.

### Additional Technical Info
`GetOutValue` performs the normal forward translation for one mapping input.

**Implementation**

Velox creates a new query on the system connection and selects OutValue by the cached MapNum and supplied input. The table primary key `(MappingNum, InValue)` permits at most one matching input row, so a valid database state has one result. The query is opened, the first field is read if present, then the query is closed/freed.

Every call is live synchronous database I/O. The returned value is not retained in the `TvxMappingItem` cache.

**Edge cases and quirks**

- Empty string is ambiguous between no row, an intentionally empty/NULL OutValue converted to text and a swallowed database failure.
- Invalid-map diagnostics are returned as data. Check MapNum or validate mapped outputs so `Invalid Map - ...` cannot be transmitted as a business value.
- Database collation controls case/accent matching. For example, case-only input differences may resolve to the same row even though the literal strings differ.
- Read and mutation methods have no item/list locking. Concurrent Add/Delete calls can change the result between two lookups.
- Field size is NVARCHAR(255); trailing-space/collation behaviour belongs to SQL Server and configured collation rather than Velox string comparison.
- Caught exceptions produce a general event warning and do not propagate to the script.

Avoid repeated calls for the same value within one event when a local variable can hold the result. For bulk conversion, account for one database round trip/query per call.

<small>Created 2026-07-15</small>
