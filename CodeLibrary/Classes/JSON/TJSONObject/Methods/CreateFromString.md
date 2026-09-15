---
title: CreateFromString
description: Constructs a caller-owned object by parsing the supplied text directly, without the fragment wrapping used by LoadFromString.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, constructor, parsing]
---

```Delphi
constructor CreateFromString(const aString: String);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString(
    '{"reference":"DEMO-1001","quantity":2}');
  try
    Value := Payload['reference'].AsString;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`CreateFromString` constructs a caller-owned object by parsing the supplied text directly, without the fragment wrapping used by LoadFromString.

### Additional Technical Info
`CreateFromString` is the PascalScript name for a wrapper around native `TJSONObject.Create(aString)`. It creates an exact `TJSONObject`, allocates its owning value list and passes the supplied text to inherited `AsString` parsing. The returned object is caller-owned and must be freed.

Input is parsed directly; it is not wrapped as a member fragment. Leading JSON whitespace and a leading BOM are skipped by the reader. A non-object value or malformed object raises and constructor cleanup releases the partially created instance.

An empty string succeeds and leaves a non-null empty object. That object later serializes as `}` because of the empty-object serializer defect. The reader also stops after the first complete object and does not reject trailing content.

Object syntax requires quoted field names, a colon after each name and a comma or closing brace after each value. Duplicate names are accepted in insertion order. Shared scalar limitations still apply: `\uXXXX` is not decoded, exponent-only numbers fail and decimal conversion uses process locale.

This constructor differs from [`LoadFromString`](LoadFromString.md), which wraps a nonempty input whose first character is not `{` and can therefore accept a field fragment.

**External references**

- [RFC 8259 section 4: Objects](https://www.rfc-editor.org/rfc/rfc8259#section-4)
- [Embarcadero constructors](https://docwiki.embarcadero.com/RADStudio/Florence/en/Methods_(Delphi)#Constructors)

<small>Created 2026-07-20</small>
