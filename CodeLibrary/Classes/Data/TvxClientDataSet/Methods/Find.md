---
title: Find
description: Performs a case-insensitive single-value client-dataset Locate and moves the cursor when a matching record is found.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, find, locate, case-insensitive, cursor]
---

```Delphi
function Find(const KeyFields, KeyValues: string): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA1.Find('CustomerCode', 'abc-001') then
    Value := DATA1['CustomerCode'].AsString
  else
    Value := Null;
end;
```

### Usage

`Find` performs a case-insensitive single-value client-dataset Locate and moves the cursor when a matching record is found.

**Usage notes**

Use a unique single field where possible and verify the returned record when uniqueness matters. For composite keys, use a different API/workflow that accepts a Variant array or an unambiguous precomputed key.

**Errors and side effects**

Inactive state, missing/unsupported key fields, malformed numeric/date text, multiple fields with a non-array value, posting/validation, filter expression or scroll event failures can raise. Success changes every cursor-bound field value and RecordPosition; saved field objects follow the new row.

### Additional Technical Info
`Find` calls inherited client-dataset `Locate(KeyFields, KeyValues, [loCaseInsensitive])`. On success it returns true and makes the first matching record current; on ordinary no-match it returns false.

The example uses the supported clear case: one key field and one string value. It is source-reviewed and was not executed by the documentation workflow.

**Signature**

`KeyFields` uses Delphi's semicolon-separated field-name syntax. However this Velox wrapper fixes `KeyValues` to a single string. Native Locate requires a Variant array when more than one field is named, so multi-field KeyFields cannot be correctly represented by this signature and can raise during array indexing. Use one field.

**Matching behavior**

The client dataset builds an expression for the selected field and performs a case-insensitive locate with no partial-key option. String comparisons ignore case; numeric/date/Boolean fields convert the supplied string through Variant/text expression rules, which can be locale-sensitive or invalid. Null cannot be expressed by this string-only argument as Variant Null.

Locate enters browse mode, can post a pending edit, checks/fetches provider EOF, searches from the underlying cursor's beginning and fires scroll lifecycle around a successful reposition. A normal failed Locate leaves the visible current record unchanged.

**Performance and concurrency**

Cost depends on record count, active indexes and expression evaluation; do not assume a business-database round trip because this normally searches the in-memory packet. The cursor is unsynchronised.

**External references**

- [Embarcadero DocWiki: `TDataSet.Locate`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Locate) - key-field/value/options contract implemented by the client dataset.
- [Free Pascal: `TDataSet.Locate`](https://www.freepascal.org/docs-html/fcl/db/tdataset.locate.html) - compatible single-value versus Variant-array distinction.
- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - in-memory client-dataset context.

<small>Created 2026-07-15</small>
