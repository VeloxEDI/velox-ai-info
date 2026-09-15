---
title: AsDouble
description: Performs strict locale-sensitive floating conversion and writes formatted Double text through the concrete value class.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, double, floating-point, locale]
---

```Delphi
property AsDouble: Double read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
  Item: TJSONValue;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.AsString := '12.5';
    Value := Item.AsDouble;
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsDouble` performs strict locale-sensitive floating conversion and writes formatted Double text through the value class.

### Additional Technical Info
The reader returns `0.0` for a null value. Otherwise it passes [`AsString`](AsString.md) to the no-format-settings Delphi `StrToFloat` overload and returns the result narrowed to `Double`. Invalid Boolean, structured or numeric text raises `EConvertError`; leading/trailing blanks are accepted by Delphi.

The selected overload uses the process/thread global decimal separator. JSON requires a period, but this property neither enforces JSON number grammar nor supplies invariant settings. A period-form input can fail in a comma-decimal environment, while comma text can be accepted even though it is not a JSON number. The global-settings overload is documented as not thread-safe.

Writing calls the no-format-settings `FloatToStr`, then routes that locale-sensitive text through the concrete virtual String setter. On a `TJSONDouble` it parses back under the same current settings; on `TJSONString` it stores the locale form as text. A Boolean or integer can reject/range-fail, and a container interprets the text as a replacement document. Formatting can also lose binary64 detail under the Deltics/Delphi formatting path and can emit non-JSON representations for non-finite values.

Use [`AsFloat0`](AsFloat0.md) only when conversion failure must deliberately collapse to zero. Use [`AsFloat`](AsFloat.md) as the exact Velox alias of this property. Neither alias distinguishes null from numeric zero without `IsNull`.

**External references**

- [Embarcadero `StrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloat)
- [Embarcadero `FloatToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.FloatToStr)
- [Free Pascal `StrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloat.html) - compatible locale-sensitive conversion context.
- [Free Pascal `FloatToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/floattostr.html) - compatibility reference; Velox executes Delphi.
- [RFC 8259 section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6)

<small>Created 2026-07-15</small>
