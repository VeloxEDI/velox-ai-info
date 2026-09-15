---
title: CheckFields
description: Concatenates selected current-row field strings after comma tokenisation, without delimiters or null/type markers.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, checkfields, comparison, tokenisation, collision]
---

```Delphi
function CheckFields(aFieldNames: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DATA1.CheckFields('CustomerCode,Status,UpdatedAt');
end;
```

### Usage

`CheckFields` concatenates selected current-row field strings after comma tokenisation, without delimiters or null/type markers.

**Usage notes**

Use only for lightweight comparisons under a fixed schema/order/locale. Trim and validate a configuration-provided field list before calling. Do not use the result as a canonical key, secure hash or unambiguous serialization.

**Side effects and errors**

The method reads the current row without navigation or data mutation. Inactive/destroyed state, a missing/space-prefixed field, unsupported conversion or field event can raise. The retained builder is mutable and unsynchronised.

### Additional Technical Info
`CheckFields` returns a delimiter-free concatenation of `AsString` for selected fields in the current record. `aFieldNames` is a comma-separated Velox token list, not the semicolon syntax used by dataset indexes/Locate.

The example selects three required fields. It is source-reviewed and was not executed by the documentation workflow.

**Signature**

**Tokenisation**

Velox `StringToToken` scans characters and splits only at commas. Empty tokens are discarded, but non-empty tokens are not trimmed. Thus `A,,B,` selects A and B, while `A, B` looks for the literal field name with a leading space and normally raises. Duplicate tokens append a field more than once. An empty argument yields an empty result.

Each token is passed to required `Fields.FieldByName`, whose normal lookup is case-insensitive but untrimmed. Unknown names raise before a normal result is returned.

**Concatenation and collisions**

The method reuses the dataset's private 400-character-growth builder, resets Position to zero, and appends every selected `AsString` with no separator, name, length, type or null marker. Distinct selected values can collide (`1`+`23` versus `12`+`3`), and null commonly collides with empty text. Locale/field formatting also affects output.

The token list is freed in a `finally` block. That block also copies the partial builder text to the local Result, but an exception is still re-raised; callers do not receive the partial result.

**Performance**

Cost is proportional to the argument length, number of tokens and rendered field length. Named lookups lowercase/hash each token. Builder capacity persists after large results.

**External references**

- [Embarcadero DocWiki: `TFields.FieldByName`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.FieldByName) - required named lookup used for each token.
- [Embarcadero DocWiki: `TField.AsString`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsString) - field conversion used in the result.
- [Free Pascal: `TField.AsString`](https://www.freepascal.org/docs-html/fcl/db/tfield.asstring.html) - compatible conversion context; tokenisation/concatenation are Velox-specific.

<small>Created 2026-07-15</small>
