---
title: AsFloat
description: Exposes the exact read/write alias of AsDouble, including strict locale-sensitive conversion and failures.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, float, double, locale]
---

```Delphi
property AsFloat: Double read write;
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
    Value := Item.AsFloat;
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsFloat` exposes the exact read/write alias of AsDouble, including strict locale-sensitive conversion and failures.

### Additional Technical Info
`AsFloat` is a Velox-added naming alias. Its reader is exactly the same `get_AsDouble` routine and its writer is exactly the same `set_AsDouble` routine as [`AsDouble`](AsDouble.md); despite the name, the script type remains 64-bit `Double`, not Delphi `Single`.

Reading null returns `0.0`. A non-null read calls locale-sensitive `StrToFloat(AsString)` and raises `EConvertError` for invalid text. Writing formats with locale-sensitive `FloatToStr` and sends the text to the concrete virtual String setter. All type-dependent container replacement, scalar validation, precision, non-finite, locale and global-settings thread-safety constraints documented for `AsDouble` apply without modification.

Use the alias that makes the surrounding Velox configuration clearest, but do not treat the two names as distinct representations or conversion policies. Use [`AsFloat0`](AsFloat0.md) for the separate default-on-read behavior, and inspect [`IsNull`](IsNull.md) to preserve null-versus-zero meaning.

**External references**

- [Embarcadero `StrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloat)
- [Embarcadero `FloatToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.FloatToStr)
- [Free Pascal `StrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloat.html) - compatible conversion context.
- [Free Pascal `FloatToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/floattostr.html) - compatibility reference; Velox executes Delphi.

<small>Created 2026-07-15</small>
