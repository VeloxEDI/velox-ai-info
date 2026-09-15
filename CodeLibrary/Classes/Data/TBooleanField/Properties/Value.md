---
title: Value
description: Reads or writes the current record's Boolean value while collapsing a null read to False.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, boolean, field, value, 'null']
---

```Delphi
property Value: Boolean read write
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

Reads or writes the current record's Boolean value while collapsing a null read to False.

**Behaviour**

- Reading uses the current dataset record at the instant of the call.
- Writing replaces null or the prior value with a non-null Boolean in the current record buffer.
- A write requires an active writable field and the dataset's edit, insert or equivalent state.
- The property does not call `Post`, apply updates, execute SQL or commit a transaction.

**Important usage notes**

- Null and False are observationally identical through Value alone. `IsNull` plus Value must be treated as a two-operation snapshot and can become stale if nested/concurrent code moves the cursor.
- The field's text can use custom phrases, abbreviations and locale rules, but Value accepts only the script Boolean type.
- A direct class cast does not validate a field definition; casting a non-Boolean runtime field is invalid.

**Errors**

Inactive dataset, invalid current record, read-only/calculated field, wrong edit state, invalid cast and dataset buffer/event errors can raise. There is no automatic edit, rollback or error translation in the Velox helper.

**Usage notes**

Use `Value` for Boolean logic and `DisplayValues` only for presentation/string interchange. Explicitly decide how null should map before assigning the result to a non-nullable Boolean variable or destination field.

### Additional Technical Info
`Value` reads or writes the typed Boolean value on the owning dataset's current record. A read returns False for both stored False and null, so check `IsNull` first when the distinction matters.

The example preserves nullable Boolean semantics for a fictional field. It is source-reviewed and was not executed by the documentation workflow.

The property is equivalent to this class's inherited `AsBoolean` path. `DisplayValues` does not affect it.

**Implementation**

The Velox runtime helpers directly call native `TBooleanField.Value`. On read, `GetAsBoolean` asks `GetData` for the current field buffer and explicitly returns False when no non-null value is available.

On write, `SetAsBoolean` normalises False to zero and True to one in a two-byte `WordBool` buffer, then calls the dataset field's `SetData`. The write is a typed Boolean operation; it does not parse text or consult locale/display phrases.

**Side effects**

Assignment marks the current field/record modified through the owning dataset's normal event path. It does not change `DisplayValues` or any other record.

**Performance and concurrency**

The value is fixed-size and access is normally constant time. The dataset cursor and record buffer are shared mutable state without an atomic IsNull-plus-Value API; coordinate access when a dataset can be reused or navigated by nested code.

**Related entries**

- [`DisplayValues`](DisplayValues.md) controls only the field's string/display conversion.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBooleanField.Value`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TBooleanField.Value) - the typed Delphi property registered by Velox.
- [Free Pascal: `TBooleanField.Value`](https://www.freepascal.org/docs-html/fcl/db/tbooleanfield.value.html) - compatible typed property context; current behaviour follows Delphi source.

<small>Created 2026-07-15</small>
