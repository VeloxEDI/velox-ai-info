---
title: OptDouble
description: Converts a present non-null field with locale-sensitive StrToFloat and uses the required default only for absence or null.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, optional, double]
---

```Delphi
function OptDouble(const aName: String;
  const aDefault: Double): Double;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"amount":12.5}');
  try
    Value := Payload.OptDouble('amount', 0.0);
  finally
    Payload.Free;
  end;
end;
```

### Usage

`OptDouble` converts a present non-null field with locale-sensitive StrToFloat and uses the required default only for absence or null.

### Additional Technical Info
`OptDouble` uses side-effect-free, case-insensitive first-match lookup. The required `aDefault` is returned only when the field is absent or its node is null.

A present node is converted through `TJSONValue.AsDouble`, which calls Delphi `StrToFloat(value.AsString)` with process `FormatSettings`. Standards-compliant dot-decimal JSON can therefore fail under a decimal-comma locale. Invalid or incompatible text raises `EConvertError`; it is not replaced by the default.

The method can return NaN or infinity if the underlying Delphi converter/node contains one, although RFC 8259 does not permit those JSON numbers. Duplicate names select the first physical value, and no missing field is inserted.

**External references**

- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)
- [Embarcadero `StrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloat)
- [Free Pascal `StrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloat.html) - compatible locale/error context.

<small>Created 2026-07-20</small>
