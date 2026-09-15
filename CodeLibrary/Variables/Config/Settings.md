---
title: "Settings"
description: "Provides the shared lazy cache for typed values read from the Velox Setting database table."
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - settings
  - database
---

```Delphi
Settings: TvxSettingVariableList
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Settings['PartnerTimeoutSeconds'].AsInteger0;
end;
```

### Usage

`Settings` provides the shared lazy cache for typed values read from the Velox Setting database table.

**First-read query and conversion**

On the first case-insensitive access to a code, Velox creates a variable and executes:

```SQL
SELECT Value, ValueType FROM [Setting] WHERE Code = '<code>'
```

Velox concatenates `code` between quotes without `SafeSQL`, escaping or parameters. Only use fixed, governed setting identifiers. Passing external/user data is an SQL-injection boundary.

Exact `ValueType` handling is:

| ValueType | Result rule |
|---|---|
| `String` | database value; SQL Null becomes `''` |
| `Boolean` | ordinal nonzero is true; string true only for exact `True` or `true`; Null becomes false |
| `Integer` | Null/non-numeric becomes integer zero; otherwise the database value |
| `Decimal` | Null/non-numeric becomes decimal zero |
| `Time` | Null becomes zero; otherwise Velox time parsing |
| `DateTime` | Null becomes zero; parses `yyyy-mm-dd hh:nn:ss` |
| `Date` | Null becomes zero; parses `yyyy-mm-dd` |

Missing rows or unrecognized case-sensitive `ValueType` text leave `Null`. SQL/conversion exceptions are caught, logged as a Setting-table warning and also return/cache `Null`.

**Caching and ownership**

The first result is cached process-wide. Database changes are not automatically refreshed. Writing `Settings['Code'].Value` or an `As...` property changes only that cached variable; it does not update `[Setting]`. `RemoveVariable(code)` forces a future re-query but is global cache invalidation. `FreeAllVariables` can invalidate every shared reference and should not be used by ordinary scripts.

Never free `Settings` or returned variables. Check `VarIsNull` where absence/error differs from zero/empty, and avoid repeated first-time lookups in record loops.

### Additional Technical Info
`Settings` is the global `TvxSettingVariableList`. It inherits the default `Variable` property, so `Settings['Code']` returns a cached `TvxVariable` with typed value/conversion properties.

The subclass is hidden in Code Library navigation because it adds no public members of its own; its inherited script surface is documented under [`TvxVariableList`](../../Classes/Config/TvxVariableList.md).

<small>Created 2026-07-19</small>
