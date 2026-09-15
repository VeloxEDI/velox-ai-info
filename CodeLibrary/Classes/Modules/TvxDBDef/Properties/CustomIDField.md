---
title: CustomIDField
description: Gets or sets the raw database field identifier updated when Velox flags source records as processed.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - database-definition
  - field
  - sql
---

```Delphi
property CustomIDField: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.CustomIDField
  else
    Value := '';
end;
```

### Usage

`CustomIDField` gets or sets the raw database field identifier updated when Velox flags source records as processed.

**Security, errors and quirks**

- Use only a trusted field identifier already verified against every dataview/table configured for flagging.
- Velox does not quote the identifier. Reserved words, whitespace, qualified names and database-specific casing/quoting rules can make the generated statement fail.
- Untrusted or syntactically active text can change the generated SQL. Never copy transaction/user input into this property.
- An empty or missing field is not rejected by the setter; failure occurs later when configuration is checked or SQL executes.
- Different flagged dataviews share this one definition-level field setting. It must be valid for each effective target table.
- Assignment does not save the module. It can affect only the current loaded instance unless an authorised host workflow persists the configuration.

### Additional Technical Info
`CustomIDField` contains the database column name that Velox places on the left side of the processed-record update assignment.

New definitions default to an empty string. Older FloID-style configuration can migrate to `XFLO_ID`.

**Implementation and use**

The runtime helper directly reads/writes the stored field. It performs no trimming, identifier validation, quoting, schema lookup or persistence operation.

When flagging runs, the SQL dataview terminal concatenates this value directly into SQL shaped like:

```SQL
UPDATE <table> SET <CustomIDField>=<processed CustomIDValue> WHERE ...
```

Assignment therefore changes live definition configuration that may be consumed after successful flow processing; it does not update any database row immediately.

**Performance and concurrency**

Field access is constant-time. The later update is database work. Do not mutate the identifier while the definition is processing or being finalised.

**Related entries**

- [`CustomIDValue`](CustomIDValue.md) and [`CustomIDValueProcessed`](../Methods/CustomIDValueProcessed.md) — right-hand expression and tag-expanded result.
- [`UpdateIDFields`](UpdateIDFields.md) and [`DoUpdateIDFields`](DoUpdateIDFields.md) — update gates.
- [`TvxDBDef`](../../TvxDBDef.md) — generated SQL and lifecycle.

<small>Created 2026-07-15</small>
