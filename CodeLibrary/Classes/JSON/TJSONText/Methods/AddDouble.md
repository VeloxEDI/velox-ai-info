---
title: AddDouble
description: Adds a named binary64 number while exposing the hidden misparented TJSONNumber return type and locale-sensitive JSON output.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, adddouble, double, locale, precision]
---

```Delphi
function AddDouble(const aName: String;
  const aValue: Double): TJSONNumber;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddDouble('amount', 12.5);
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddDouble` adds a named binary64 number while exposing the hidden misparented TJSONNumber return type and locale-sensitive JSON output.

### Additional Technical Info
`AddDouble` constructs `TJSONDouble`, assigns `aName` and the binary64 payload, and transfers the node to the receiver. The parent owns the node. The declared result is hidden `TJSONNumber`, whose PascalScript ancestor is incorrectly registered as `TObject` rather than `TJSONValue`; the returned expression therefore exposes no generic JSON properties. Usually ignore the result and reacquire the child through an object/array lookup typed as `TJSONValue`.

The stored payload is a Delphi `Double`. Serialization delegates to `FloatToStrF(..., ffGeneral, 15, 0)`. It is limited to 15 significant digits and uses process format settings, so a locale whose decimal separator is a comma can produce invalid JSON or conflict with delimiters. Binary rounding also applies.

No finite-value check exists. NaN or infinity accepted by the script/runtime can serialize as implementation-specific non-JSON tokens. This method therefore does not guarantee RFC-compliant numeric output; validate range, finiteness and the serialized text when exchanging data with strict systems.

The allocated child is mutable and borrowed. Parent deletion, erase/reload or destruction invalidates it. Allocation/assignment/insertion exceptions propagate, and an exception during the final owning-list Add can leak the child because the method has no cleanup guard.

**External references**

- [Embarcadero `FloatToStrF`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.FloatToStrF)
- [Free Pascal `FloatToStrF`](https://www.freepascal.org/docs-html/rtl/sysutils/floattostrf.html) - analogous formatting context; exact digits and format settings are Delphi's.
- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)

<small>Created 2026-07-15</small>
