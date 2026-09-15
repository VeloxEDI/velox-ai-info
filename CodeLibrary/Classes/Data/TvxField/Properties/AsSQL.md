---
title: AsSQL
description: Quotes formatted field display text for SQL-shaped output but has a lossy, unvalidated setter that is not its inverse.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, sql, quote, displaytext, lossy, security]
---

```Delphi
property AsSQL: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Getter only: use parameters rather than concatenating SQL when available. }
  Value := Field.AsSQL;
end;
```

### Usage

`AsSQL` quotes formatted field display text for SQL-shaped output but has a lossy, unvalidated setter that is not its inverse.

**Lossy setter defect**

The setter calculates:

```Delphi
lValue := Copy(Value, 2, Length(Value) - 3);
```

It then converts doubled apostrophes to singles and assigns `AsString`. For the normally quoted input `'abc'`, `Copy` returns `ab`: Velox removes the opening quote plus the closing quote **and the final data character**. It does not validate that quotes exist. Short/malformed values can become empty or unexpectedly truncated.

The setter is therefore not the inverse of the getter. Avoid it; do not round-trip `Field.AsSQL := Field.AsSQL`. Assignment also follows the field's edit, conversion and validation behavior and can raise after the truncation has occurred in memory.

The getter allocates replacement strings proportional to display length. Neither accessor posts or commits; the setter changes the current record only.

### Additional Technical Info
The `AsSQL` getter passes the field's formatted `DisplayText` to Velox `SafeSQL`.

`SafeSQL` performs these text operations in order:

1. remove every NUL character (`#0`);
2. replace every apostrophe with two apostrophes; and
3. wrap the result in single quotes.

For example, display text `O'Brien` becomes `'O''Brien'`. Database null normally has empty display text and becomes `''`, **not** SQL `NULL`. Numeric, Boolean and date values are also quoted as strings. Because the source is `DisplayText`, field display formats and `OnGetText` can change the literal independently of the raw value.

This is product-specific SQL-shaped text, not type-aware serialization or parameter binding. Prefer parameters. Do not use it for identifiers, complete SQL fragments or authorization-sensitive construction.

**External references**

- [Embarcadero DocWiki: `TField.DisplayText`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.DisplayText) documents the formatted source used by the getter.
- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents concrete conversion behavior. The quoting and defective substring count are Velox-specific.

<small>Created 2026-07-15</small>
