---
title: CheckAll
description: Returns a delimiter-free concatenation of every current-row field's AsString value for lightweight change comparison.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, checkall, comparison, fields, collision]
---

```Delphi
function CheckAll: string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Capture before work that may change DATA1's current row.
  Value := DATA1.CheckAll;
end;
```

### Usage

`CheckAll` returns a delimiter-free concatenation of every current-row field's AsString value for lightweight change comparison.

**Errors**

Inactive/destroyed dataset state, invalid fields, BLOB/object conversions or field event/conversion failures can raise. A zero-field schema returns an empty string. The method does not catch or annotate errors.

**Usage notes**

Use only as a lightweight comparison signal under an identical schema, field order, locale and formatting context. It is neither collision-resistant nor suitable as a canonical row identity, cryptographic hash or audit value.

### Additional Technical Info
`CheckAll` returns one string made by appending `AsString` for every field in the current record, in field-list order. It is intended as input to Velox change-detection logic; it does not itself hash, compare or store anything.

The example returns the snapshot string directly. It is source-reviewed and was not executed by the documentation workflow.

**Signature**

**Implementation**

The dataset lazily creates one private `TvxStringAppend` with growth size 400, resets its Position to zero, captures `FieldCount`, then appends `Fields[I].AsString` from zero through count minus one. `Data` copies exactly the accumulated characters to the result. The builder is retained and reused by later CheckAll/CheckFields calls.

There is no delimiter, field name, length, type tag or null marker. For example, fields `['1','23']` and `['12','3']` both produce `123`. Null and an empty string commonly both contribute no characters. Locale/display conversion, floating/date formatting and schema order can also change the result without changing the underlying business meaning.

**Cursor and side effects**

The method reads only the current record and does not navigate, edit, post or apply data. If EOF is true because Last was called, the active record can still be the real last row and its values are read. The dataset/schema must be active and valid; unsupported field-to-string conversion can raise.

Repeated calls reuse mutable buffer storage but return a separate Delphi string. The method is unsynchronised and must not run concurrently on the same dataset.

**Performance**

Time and result size are proportional to the number and rendered length of all fields. Buffer capacity is retained after a large row, increasing the instance's long-lived memory footprint but reducing later allocations.

**External references**

- [Embarcadero DocWiki: `TField.AsString`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsString) - authoritative Delphi string-conversion surface used for each field.
- [Free Pascal: `TField.AsString`](https://www.freepascal.org/docs-html/fcl/db/tfield.asstring.html) - compatible conversion context; delimiter-free concatenation is Velox-specific.

<small>Created 2026-07-15</small>
