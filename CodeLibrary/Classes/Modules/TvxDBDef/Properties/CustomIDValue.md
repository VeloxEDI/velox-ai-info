---
title: CustomIDValue
description: Gets or sets the raw tag-capable SQL expression assigned to the processed-record flag field.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - database-definition
  - sql-expression
  - tags
---

```Delphi
property CustomIDValue: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.CustomIDValue <> ''
  else
    Value := False;
end;
```

### Usage

`CustomIDValue` gets or sets the raw tag-capable SQL expression assigned to the processed-record flag field.

**Security, errors and quirks**

- Treat the property as trusted executable database configuration. Never construct it from untrusted user/message/file values.
- Tag expansion can introduce context-sensitive data and SQL-active characters. Verify the final expression for every intended context and database.
- Plain text such as `Processed` is not automatically converted to the SQL literal `'Processed'`.
- The setter does not process tags, parse SQL, validate data types, test the database or persist the module.
- An empty or invalid expression can remain stored until a later flagging attempt fails.
- Reading or logging the raw/processed expression can disclose embedded values or expanded secrets.

### Additional Technical Info
`CustomIDValue` stores the raw SQL expression that Velox assigns to [`CustomIDField`](CustomIDField.md) when it flags records as processed.

New definitions default to an empty string. Older FloID-style configuration can migrate to `XFLO_ID + 1`.

**Implementation and use**

The runtime helper directly reads/writes the stored string. Immediately before native flagging builds SQL, [`CustomIDValueProcessed`](../Methods/CustomIDValueProcessed.md) expands definition data tags and system tags. The result is then concatenated after `SET <field>=` without quoting or parameter binding.

This is an SQL expression, not a typed Delphi value. For example, a numeric expression, SQL function or already-quoted string literal must use syntax accepted by the configured database driver. Velox does not infer the field type or add string quotes.

**Side effects, performance and concurrency**

Assignment changes only in-memory module state. A later successful-flow finalisation can use that changed state to update multiple source rows. Access is constant-time, but do not mutate the expression while records are being processed/finalised or share the mutable definition across unsynchronised threads.

**Related entries**

- [`CustomIDValueProcessed`](../Methods/CustomIDValueProcessed.md) — exact tag-processing call and result limitations.
- [`CustomIDField`](CustomIDField.md) — target column identifier.
- [`UpdateIDFields`](UpdateIDFields.md), [`DoUpdateIDFields`](DoUpdateIDFields.md) and [`TvxDBDef`](../../TvxDBDef.md) — gates and update lifecycle.

<small>Created 2026-07-15</small>
