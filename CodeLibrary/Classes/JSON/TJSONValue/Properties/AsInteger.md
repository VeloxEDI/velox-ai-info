---
title: AsInteger
description: Converts Boolean, String or numeric JSON values to signed 32-bit integers and writes decimal text.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, integer, conversion, overflow]
---

```Delphi
property AsInteger: Integer read write;
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
    Item.AsString := '2147483647';
    Value := Item.AsInteger;
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsInteger` converts Boolean, String or numeric JSON values to signed 32-bit integers and writes decimal text.

### Additional Technical Info
The reader returns `0` for null, maps a non-null Boolean to `1`/`0`, and sends String or `jsNumber` raw text to Delphi `StrToInt`. The script `Integer` is signed 32-bit: values outside `-2147483648..2147483647`, fractional/exponent text and malformed input raise `EConvertError`. Arrays, objects and unsupported kinds raise `EJSONError`.

The Delphi parser is broader than JSON integer grammar because it accepts documented Delphi integer notations such as hexadecimal. A `TJSONDouble` supplies locale-formatted text first, so even a numeric node can fail if it contains a fraction or unsuitable representation. Use [`AsInt64`](AsInt64.md) when the source can exceed 32-bit range.

Writing applies `IntToStr`, then invokes the actual class's virtual text setter. String and integer nodes store the decimal value; Double stores the numeric equivalent; incompatible Boolean/container targets can raise or follow their class-specific replacement behavior. Assignment makes ordinary compatible scalars non-null.

Null and integer zero both read as `0`; inspect [`IsNull`](IsNull.md) when they differ. For fallback-on-invalid scalar text use [`AsInteger0`](AsInteger0.md), noting its different structured-value behavior.

**External references**

- [Embarcadero `StrToInt`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToInt)
- [Embarcadero `IntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.IntToStr)
- [Free Pascal `StrToInt`](https://www.freepascal.org/docs-html/rtl/sysutils/strtoint.html) - compatibility reference; non-decimal syntax differs by dialect.
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible decimal formatting context.

<small>Created 2026-07-15</small>
