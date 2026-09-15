---
title: GetInValue
description: Performs a live reverse lookup from an output value to one matching input value in Mapping_Data.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mapping, reverse-lookup, database]
---

```Delphi
function GetInValue(const aOutValue: string): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var CountryMap: TvxMappingItem;
begin
  CountryMap := Mappings['CountryCode'];
  if CountryMap.MapNum > 0 then
    Value := CountryMap.GetInValue('New Zealand')
  else
    Value := '';
end;
```

### Usage

`GetInValue` performs a live reverse lookup from an output value to one matching input value in Mapping_Data.

**Parameter**

`aOutValue` is quoted with `SafeSQL` and compared by SQL Server using the system database's collation. NUL characters are removed before the query and apostrophes are escaped.

**Returns**

- When [`MapNum`](../Properties/MapNum.md) is zero: literal `Invalid Map - '<Code>' not found.`
- When a row matches: the first row's InValue converted through the database field's `AsString` accessor.
- When no row matches: an empty string.
- On a caught database error: no distinct error sentinel; the managed string result remains empty/default and a warning is logged.

### Additional Technical Info
`GetInValue` performs a reverse mapping: it queries for an InValue whose OutValue equals the supplied text.

**Implementation**

For a valid cached MapNum, Velox opens a new system-database query selecting `InValue` from `[Mapping_Data]` by MapNum and OutValue. It reads only `Fields[0]` from the first current row, closes/frees the query and returns. No mapping-data value is cached, so every call performs synchronous database I/O.

**Edge cases and quirks**

- `[Mapping_Data]` is unique by `(MappingNum, InValue)`, not by OutValue. Multiple inputs may share one output. The query has no `ORDER BY`, so reverse lookup is nondeterministic in that case.
- Empty result is ambiguous: it can mean no row, an empty/NULL database field converted to text, or a swallowed query failure. Check/log expected domains rather than treating empty as definitive absence.
- Invalid-map text is returned as ordinary business data, not raised as an exception. Check MapNum before calling so it cannot leak into an output field unnoticed.
- Database equality follows collation and may be case/accent insensitive. It is not the in-memory code comparison.
- The method adds no lock and can race with Add/Delete. A concurrent committed change determines what the statement sees under the connection's isolation rules.
- The catch logs only a generic Mapping_Data read warning and hides the original exception from script control flow.

For one-to-one mappings, enforce output uniqueness operationally if reverse lookup must be deterministic. Prefer [`GetOutValue`](GetOutValue.md) when translating the table's unique input key in its intended direction.

<small>Created 2026-07-15</small>
