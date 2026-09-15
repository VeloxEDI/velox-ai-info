---
title: FieldByIndex
description: Returns the field whose native FieldNo matches the integer, not the field at a zero-based collection index.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, fieldbyindex, fieldno, field, warning]
---

```Delphi
property FieldByIndex[aIndex: Integer]: TvxField read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Field: TvxField;
begin
  // Physical data fields normally start at FieldNo 1, not zero.
  Field := DATA1.FieldByIndex[1];
  if Field = nil then
    Value := Null
  else
    Value := Field.AsVariant;
end;
```

### Usage

`FieldByIndex` returns the field whose Velox FieldNo matches the integer, not the field at a zero-based collection index.

**Usage notes**

Prefer the default named `FieldName` property for business logic. For true ordinal schema iteration, use the dataset's `Fields[0..Count-1]` surface, not this property.

**Errors and side effects**

Lookup itself does not navigate or mutate data and returns nil on absence. Dereferencing nil, using a dangling field, or reading/converting the found current value can raise.

### Additional Technical Info
`FieldByIndex` is misleadingly named. Its getter calls `Fields.FieldByNumber(aIndex)` and returns the field whose `FieldNo` equals the argument. It does not call the zero-based `Fields[aIndex]` property.

The example tests nil because no matching FieldNo is an ordinary result. It is source-reviewed and was not executed by the documentation workflow.

Physical dataset fields normally use positive field numbers (commonly starting at 1). Calculated/lookup/object/sparse fields can make field number and visible list position differ. Negative, zero, gaps or numbers beyond the schema simply produce nil when no field carries that FieldNo; there is no collection-bounds exception from this getter.

**Implementation and facade**

Delphi `TFields.FieldByNumber` linearly scans the physical list and compares each field's `FieldNo`. Velox casts the found ordinary concrete `TField` object to `TvxField`. This is an intentional facade: it does not change the runtime object class or ownership, but enables the method-only Velox field surface. The dataset still owns the result.

The object follows current-record navigation and becomes invalid after schema destruction/rebuild. Some `TvxField` convenience members assume a compatible concrete field type; follow their individual preconditions.

**Performance and concurrency**

Lookup is linear in field count. The returned field/cursor is mutable and unsynchronised.

**External references**

- [Embarcadero DocWiki: `TFields.FieldByNumber`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.FieldByNumber) - authoritative FieldNo search contract.
- [Free Pascal: `TFields.FieldByNumber`](https://www.freepascal.org/docs-html/fcl/db/tfields.fieldbynumber.html) - compatible nil-on-no-matching-FieldNo behavior.

<small>Created 2026-07-15</small>
