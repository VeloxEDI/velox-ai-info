---
title: GetChildDouble
description: Converts a non-null nested value through locale-sensitive floating parsing or returns the required missing/null default.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, child, double]
---

```Delphi
function GetChildDouble(const aChildObjectName, aName: String;
  const aDefault: Double): Double;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString(
    '{"totals":{"amount":12.5}}');
  try
    Value := Payload.GetChildDouble('totals', 'amount', 0.0);
  finally
    Payload.Free;
  end;
end;
```

### Usage

`GetChildDouble` converts a non-null nested value through locale-sensitive floating parsing or returns the required missing/null default.

### Additional Technical Info
`GetChildDouble` performs a first case-insensitive lookup for an actual child object and a second for a non-null value. It returns the required `aDefault` only when the outer field is missing, null or not a `TJSONObject`, or the inner field is missing or null.

A present value is converted by `TJSONValue.AsDouble`, which calls Delphi `StrToFloat(value.AsString)` with process format settings. Dot-decimal JSON can therefore fail or be interpreted differently under a decimal-comma locale. Invalid, incompatible or out-of-range text raises `EConvertError`; the method does not fall back to `aDefault` after conversion starts.

Names select the first duplicate at each level. Lookups use `FindValue` and do not mutate the object. The returned `Double` can represent non-finite values even though JSON does not permit them.

**External references**

- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)
- [Embarcadero `StrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloat)
- [Free Pascal `StrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloat.html) - compatible locale/error context.

<small>Created 2026-07-20</small>
