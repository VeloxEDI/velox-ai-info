---
title: AsGUID
description: Parses strict braced GUID text or writes Delphi's braced GUID representation through the concrete value setter.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, guid, conversion, 'null']
---

```Delphi
property AsGUID: TGUID read write;
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
    Item.AsGUID := StringToGUID(
      '{12345678-1234-1234-1234-1234567890AB}');
    Value := Item.AsString;
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsGUID` parses strict braced GUID text or writes Velox's braced GUID representation through the value setter.

### Additional Technical Info
The reader returns the all-zero `NULLGUID` when [`IsNull`](IsNull.md) is true. Otherwise it passes [`AsString`](AsString.md) to Delphi `StringToGUID`. The parser expects the canonical braced, hyphenated hexadecimal shape and raises `EConvertError` for malformed, blank or incompatible text. JSON itself has no GUID type; this is a Velox/Deltics String convention.

The writer calls Delphi `GUIDToString` and sends its 38-character braced representation through the concrete virtual String setter. A `TJSONString` stores that form. Other scalar classes can reject it after changing null state, and a container attempts to parse it as replacement JSON. Assigning an all-zero GUID does **not** make this property null; it stores the all-zero textual GUID. Some `AddGUID` helpers instead treat all-zero as a null sentinel, so those paths are not equivalent.

Reading null and reading a stored all-zero GUID both produce the same binary record. Check `IsNull` when the distinction matters. The conversion is synchronous, constant-space apart from the returned String, and locale-independent.

**External references**

- [Embarcadero `StringToGUID`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringToGUID)
- [Embarcadero `GUIDToString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.GUIDToString)
- [Free Pascal `StringToGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/stringtoguid.html) - compatible canonical-form and failure context.
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - compatible output-shape context.

<small>Created 2026-07-15</small>
