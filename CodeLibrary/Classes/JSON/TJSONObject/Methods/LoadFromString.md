---
title: LoadFromString
description: Replaces values from a complete object or auto-wrapped member fragment, with first-character whitespace and empty-input traps.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, string, parsing]
---

```Delphi
procedure LoadFromString(const aJSONString: String);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.Create;
  try
    Payload.LoadFromString('"reference":"DEMO-1001","quantity":2');
    Value := Payload.AsString;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`LoadFromString` replaces values from a complete object or auto-wrapped member fragment, with first-character whitespace and empty-input traps.

### Additional Technical Info
`LoadFromString` accepts either a complete object beginning with `{` or a field fragment. For any nonempty input whose first character is not `{`, it prepends `{` and appends `}` before assigning inherited `AsString`.

The first-character test happens before trimming. A fragment with leading whitespace is wrapped usefully, but a complete object preceded by whitespace is wrapped as a nested fragment and then fails because the outer object parser expects a quoted field name. The direct [`CreateFromString`](CreateFromString.md) path does not wrap and accepts leading JSON whitespace.

Empty input is assigned without wrapping. `TJSONObject.DoSetAsString` first clears the inherited private null-storage bit, but the parser then reads no value and existing children remain. The internal bit change has no public effect because `TJSONText.IsNull` is fixed false and object serialization ignores that storage. This is not a reliable reset operation—use `Erase` when the values must be removed.

Malformed, wrong-type or wrapped-invalid input raises. Parsing occurs before replacement, so old children remain on those errors; only the unobservable private bit has already been cleared. A successful load frees the old graph and deep-clones parsed values.

Duplicate names and trailing input are accepted. `\uXXXX`, exponent-only numbers and locale-sensitive decimals retain the shared reader defects. A successfully parsed empty object later serializes as `}`.

**External references**

- [RFC 8259 section 4: Objects](https://www.rfc-editor.org/rfc/rfc8259#section-4)

<small>Created 2026-07-20</small>
