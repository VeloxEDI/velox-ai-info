---
title: TBooleanField
description: Represents the current record's nullable Boolean field with configurable text used for display and string assignment.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, boolean, field, 'null']
---

```Delphi
TBooleanField = class(TField)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Flag: TBooleanField;
begin
  Flag := TBooleanField(DATA_Self.FieldByName('Enabled'));
  if Flag.IsNull then
    Value := Null
  else
    Value := Flag.Value;
end;
```

### Usage

`TBooleanField` represents the current record's nullable Boolean field with configurable text used for display and string assignment.

**Behaviour**

The field object is owned by its dataset and addresses that dataset's current record. Reading requires valid active record context. Writing requires a writable field and the owning dataset's edit, insert or equivalent state; it updates the record buffer but does not post, apply updates or commit a transaction.

By default, text conversion uses `True` and `False`. `DisplayValues` can replace those phrases for this field object across every record. It affects string/display access, not typed Boolean Value.

**Usage notes**

Do not free the field. Keep the field lookup, null check and value access close together so nested code cannot silently move the dataset cursor between them.

### Additional Technical Info
`TBooleanField` represents Boolean data on the current record of an owning dataset. Its typed `Value` is Boolean, while `DisplayValues` controls the phrases used when the field is read or assigned as text.

The example preserves the distinction between null and False for a fictional field. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox registers Delphi `Data.DB.TBooleanField` as a descendant of `TField` and exposes two direct property helpers. Scripts normally obtain the field from an active dataset's `FieldByName` or `Fields` collection. No constructor is registered for scripts.

Native field storage is a two-byte `WordBool`. A typed write stores zero for False or one for True through the dataset's normal field-data path. A typed read returns False when native `GetData` reports null, so `Value` alone cannot preserve three-state logic.

**Edge cases and quirks**

- Null reads as False through `Value` and inherited `AsBoolean`. Check `IsNull` first whenever null has different business meaning.
- A cast from `TField` is valid only when the runtime field is actually `TBooleanField` or a compatible descendant.
- Moving, filtering, closing or rebuilding the dataset changes or invalidates the same borrowed field reference.
- String assignment can accept case-insensitive prefixes of configured display phrases and resolves overlapping prefixes False-first; typed Value assignment has no such parsing.

**Performance and concurrency**

Typed reads/writes are constant-size dataset operations. `DisplayValues` is mutable field-wide metadata and dataset cursor/edit state is shared; do not read or mutate the same field/dataset concurrently without external coordination.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBooleanField`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TBooleanField) - the Delphi field class used by Velox.
- [Free Pascal: `TBooleanField`](https://www.freepascal.org/docs-html/fcl/db/tbooleanfield.html) - compatible class and acquisition context; Velox executes Delphi's implementation.

<small>Created 2026-07-15</small>
