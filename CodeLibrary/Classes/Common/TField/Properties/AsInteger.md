---
title: AsInteger
description: Reads or writes the concrete field through a signed 32-bit integer conversion, including descendant-specific rounding, range and null behaviour.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, integer, conversion, range]
---

```Delphi
property AsInteger: LongInt read write;
```

### Example

```Delphi
procedure IncrementAttempts(const Data: TvxClientDataSet);
begin
  Data.Edit;
  Data.FieldByName('AttemptCount').AsInteger :=
    Data.FieldByName('AttemptCount').AsInteger + 1;
end;
```

### Usage

`AsInteger` reads or writes the field through a signed 32-bit integer conversion, including type-specific rounding, range and null behaviour.

- Check [`DataType`](DataType.md) and range before converting large identifiers or counts.
- Use [`AsVariant`](AsVariant.md) when a 64-bit value must remain dynamically typed and supported by the field.
- Preserve null separately instead of using sentinel zero unless the mapping contract defines it.

### Additional Technical Info
PascalScript exposes `AsInteger` as `LongInt`, matching Delphi's signed 32-bit `Integer` in the supported Windows build.

#### Source-backed behaviour

The runtime helper delegates to native `TField.AsInteger`; base access raises. Integer descendants read their native buffer and return zero for null. Narrow descendants enforce their signed/unsigned range on assignment. Numeric descendants may round a floating value, and a string descendant parses decimal text and raises on invalid input. Values outside `-2147483648..2147483647` cannot be represented through this member even when the database field is 64-bit.

Writing requires a dataset write state and flows through field read-only checking, validation, DSBase verification, buffer mutation and change notification. Reading zero cannot distinguish a database null from numeric zero; use [`IsNull`](IsNull.md) first. The Velox helper `AsInteger0` intentionally also maps null/empty textual representations to zero, so it does not restore null information.

#### Official RTL references

- [Embarcadero: TField.AsInteger](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsInteger)
- [Free Pascal: TField.AsInteger](https://www.freepascal.org/docs-html/current/fcl/db/tfield.asinteger.html)

<small>Created 2026-07-15</small>
