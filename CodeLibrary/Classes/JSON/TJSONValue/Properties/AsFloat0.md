---
title: AsFloat0
description: Reads a locale-sensitive floating value with zero fallback while retaining the strict AsDouble writer.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, float, default, locale]
---

```Delphi
property AsFloat0: Double read write;
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
    Item.AsString := 'not-a-number';
    Value := Item.AsFloat0;  // 0.0; conversion failure is suppressed.
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsFloat0` reads a locale-sensitive floating value with zero fallback while retaining the strict AsDouble writer.

### Additional Technical Info
The reader returns `0.0` when [`IsNull`](IsNull.md) is true. Otherwise it calls locale-sensitive `StrToFloatDef(DoGetAsString, 0.0)`. Any text conversion failure becomes `0.0` rather than an exception. Because it calls the virtual raw getter without checking `ValueType`, Booleans, malformed Strings, and even serialized objects/arrays normally collapse to zero.

This convenience loses information: valid zero, null, malformed text, incompatible type and some locale mismatches all have the same result. Check `IsNull`, `ValueType` and/or use strict [`AsDouble`](AsDouble.md) when validation or diagnostics matter.

The writer is **not** a defaulting writer. It is the exact strict `AsDouble` writer: `FloatToStr` uses current global locale settings, then the concrete value class parses/stores that text or raises. The getter and setter are therefore asymmetric. The no-format-settings conversion path is not locale-invariant and is not thread-safe under concurrent changes to global format settings.

**External references**

- [Embarcadero `StrToFloatDef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloatDef)
- [Embarcadero `FloatToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.FloatToStr)
- [Free Pascal `StrToFloatDef`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloatdef.html) - compatible default-on-failure context.
- [Free Pascal `FloatToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/floattostr.html) - compatibility reference; Velox executes Delphi.

<small>Created 2026-07-15</small>
