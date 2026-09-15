---
title: Value
description: Gets or sets the current record's typed TDateTime value, with a null read collapsing to numeric zero.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, datetime, value, 'null', dataset]
---

```Delphi
property Value: TDateTime read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  DateTimeValue: TDateTimeField;
begin
  DateTimeValue := TDateTimeField(Dataview.Query.FieldByName('ProcessedAt'));
  if DateTimeValue.IsNull then
    Value := Null
  else
    Value := DateTimeValue.Value;
end;
```

### Usage

Gets or sets the current record's typed TDateTime value, with a null read collapsing to numeric zero.

**Behaviour**

- Reading follows the dataset cursor; navigation changes the represented record.
- Writing zero stores the real zero date/time. It does not clear/null the field.
- Use `Clear` to write null.
- For `TDateField` and `TTimeField`, the same property is but the provider/Velox field represents only date or time and can discard the other component.
- Posting the dataset makes the edit part of its in-memory change set; external persistence still depends on ApplyUpdates/save/transaction/flow success.

**Errors**

Writes can raise when the dataset is missing, inactive/read-only/not editing, the field is read-only/calculated, validation or constraints fail, conversion is unsupported, or the provider/database rejects the value. Reads can raise for invalid/destroyed dataset state.

### Additional Technical Info
`Value` reads or writes the current record's date/time as Delphi `TDateTime`. It is the typed version of `AsDateTime`. **A null read returns numeric zero**, so always check `IsNull` or use `AsVariant` when null must remain distinct from 30 December 1899.

The example preserves that distinction and retains no field reference beyond the event. The cast requires a configured `TDateTimeField`/date/time descendant. It is source-reviewed and was not executed by the documentation workflow.

`TDateTime` is an eight-byte `Double`: whole-number days are relative to 30 December 1899 and the fraction represents time of day. It contains no timezone or offset.

**Implementation**

When the reusable I/O buffer exists and the field is not currently validating, the getter first writes Double zero to that buffer. It then calls the owning dataset's `GetFieldData` in converted/non-native mode. When data exists, it reads a Double from the buffer. When the dataset reports null, `GetAsDateTime` returns zero. `AsFloat` delegates to the same getter; `AsVariant` instead returns a date Variant or Null.

The setter writes the supplied Double to that I/O buffer and calls `SetFieldData` in converted/non-native mode. The field class performs no local range, finite-value, timezone or subtype check before delegating. The dataset/provider converts to its native representation and applies edit-state, validation, constraints and change events.

**Edge cases and quirks**

- Null and 30 December 1899 compare equal through Value alone. A default `0` variable can therefore hide missing data.
- TDateTime is a civil numeric value, not an instant. Arithmetic does not account for timezones, daylight-saving gaps/overlaps or calendar business rules.
- NaN, infinity and out-of-range values are not rejected by this setter itself; failures or corrupt-looking output can occur later in formatting/provider/database code.
- Floating-point fractions can carry sub-millisecond approximation. Database/provider precision may round or truncate further.
- A retained field reference becomes invalid when the dataset/schema is destroyed or rebuilt; it also continues to follow the mutable current row.

**Side effects**

Reading calls dataset field access only. Writing mutates the current record buffer and can trigger field validation, calculated/dependent-field work and dataset change events. It does not itself post, apply or commit.

**Performance and concurrency**

Typed access is constant-time. The field, I/O buffer and cursor are unsynchronised and must remain in one owning Velox flow/thread.

**Remarks**

Preserve `IsNull`, define the integration's timezone convention separately and let the surrounding Velox lifecycle own edit/post/apply/transaction decisions.

**External references**

- [Embarcadero DocWiki: `TDateTimeField.Value`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDateTimeField.Value) - authoritative Delphi typed-value contract.
- [Free Pascal: `TDateTimeField.Value`](https://www.freepascal.org/docs-html/fcl/db/tdatetimefield.value.html) - compatible typed-property overview.

<small>Created 2026-07-15</small>
