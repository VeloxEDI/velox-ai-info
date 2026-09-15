---
title: TryCreate
description: Uses an existing object as a required factory receiver and returns a caller-owned parsed object or nil after assignment failure.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, trycreate, parsing]
---

```Delphi
function TryCreate(const aString: String): TJSONObject;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Factory, Payload: TJSONObject;
begin
  Factory := TJSONObject.Create;
  try
    Payload := Factory.TryCreate('{"status":"ready"}');
    if not Assigned(Payload) then
    begin
      Value := 'Invalid JSON object';
      Exit;
    end;
    try
      Value := Payload['status'].AsString;
    finally
      Payload.Free;
    end;
  finally
    Factory.Free;
  end;
end;
```

### Usage

`TryCreate` uses an existing object as a required factory receiver and returns a caller-owned parsed object or nil after assignment failure.

### Additional Technical Info
`TryCreate` has a registration defect that changes how scripts call it. The native declaration is a Delphi class function, but the compiler importer omits `class` and registers an ordinary method. PascalScript therefore requires a non-nil `TJSONObject` receiver, as in `Factory.TryCreate(...)`; `TJSONObject.TryCreate(...)` is not a supported class-qualified call.

The runtime importer also registers the native address as an ordinary method. It passes the receiver in the hidden `Self` slot where Delphi expects the class reference, but this implementation never reads `Self`: it always allocates an exact new `TJSONObject`, assigns `aString` through inherited `AsString`, and returns that separate object when no exception occurs. The factory receiver is unchanged. Both the receiver and a non-nil result are caller-owned and must be freed separately.

On any exception raised by the subsequent `AsString` assignment, it frees the new object and returns nil. The catch is not limited to expected syntax/conversion errors, so parser allocation and other unexpected assignment-time exceptions also lose their type and diagnostic text. Initial `TJSONObject.Create` runs before the native `try` block; a constructor or owning-list allocation failure there propagates instead of returning nil. A nil receiver is rejected by the PascalScript runtime before the native function is reached. Use [`CreateFromString`](CreateFromString.md) when the reason for parse failure must be logged or handled.

Input is parsed directly, without `LoadFromString` fragment wrapping. Leading JSON whitespace is accepted. Empty input succeeds with a non-null empty object, which later serializes as `}`. A non-object first value or malformed object returns nil. Trailing content after a complete first object is ignored and therefore does not cause nil.

All reader behaviors remain: duplicate names are retained, `\uXXXX` is literalized, exponent-only numbers fail and decimals use process locale.

**External references**

- [RFC 8259 section 9: Parsers](https://www.rfc-editor.org/rfc/rfc8259#section-9)

<small>Created 2026-07-20</small>
