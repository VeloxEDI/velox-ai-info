---
title: LoadFromString
description: Parses array text after optional first-character bracket wrapping, with empty-input retention and permissive grammar.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, string, parse]
---

```Delphi
procedure LoadFromString(const aJSONString: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.LoadFromString('1,"two",true');
    { Non-bracketed input is wrapped as [1,"two",true]. }
    Value := Values.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`LoadFromString` parses array text after optional first-character bracket wrapping, with empty-input retention and permissive grammar.

### Additional Technical Info
For nonempty input, `LoadFromString` checks the **first character only**. If it is not `[`, the method surrounds the entire string with brackets, then assigns the result through inherited `AsString` parsing. This permits a comma-separated sequence such as `1,"two"` as shorthand for an array.

The check occurs before trimming. Input such as ` [1,2]` is wrapped into `[ [1,2]]` and produces a nested array rather than the expected two items. A leading BOM character has the same wrapping effect. Normalise/validate input before calling when shape matters.

An empty string is passed to the parser unchanged; no value is read, so the existing array is retained rather than cleared. Use [`Erase`](Erase.md) for explicit emptying. Valid parsed content deep-replaces the old children and invalidates their borrowed references. Wrong top-level type is normally avoided by wrapping, while syntax/conversion errors raise before replacement.

The underlying parser is not strict RFC 8259 validation. It accepts missing/trailing commas and an unterminated array, ignores trailing input after the first value, does not decode `\uXXXX`, does not support exponent numbers correctly and parses decimal text through host locale. Parsed `{}` values later serialize as `}` because of the object serializer defect. A useful quirk is that `LoadFromString('null')` creates a real `TJSONNull` item and serializes as `[null]`, unlike the defective [`AddNull`](AddNull.md).

**External references**

- [RFC 8259 sections 5-7: Arrays, numbers and strings](https://www.rfc-editor.org/rfc/rfc8259#section-5)
- [Embarcadero `StrToFloat`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrToFloat)
- [Free Pascal `StrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloat.html) - analogous locale-sensitive conversion context.

<small>Created 2026-07-20</small>
