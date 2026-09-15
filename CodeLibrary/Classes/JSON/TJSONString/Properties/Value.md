---
title: Value
description: Reads or replaces raw unquoted Unicode text and clears null state without validating JSON characters.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, string, value, escaping]
---

```Delphi
property Value: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
begin
  Text := TJSONString.Create;
  try
    Text.Value := 'DEMO-1001';
    Value := Text.Value;
  finally
    Text.Free;
  end;
end;
```

### Usage

`Value` reads or replaces raw unquoted Unicode text and clears null state without validating JSON characters.

### Additional Technical Info
`Value` exposes the raw Delphi Unicode String held by [`TJSONString`](../../TJSONString.md). It contains no surrounding JSON quotation marks and no backslash encoding. A fresh node returns `''`; assigning any string, including `''`, clears inherited [`IsNull`](../../TJSONValue/Properties/IsNull.md).

No JSON validation, normalization or sanitization occurs. The property can contain quotation marks, reverse solidus characters, controls and unpaired UTF-16 surrogates. A containing array or object later escapes only quote, backslash, backspace, tab, line feed, form feed and carriage return. Other U+0000-U+001F controls remain raw and can make the parent output invalid JSON.

Reading bypasses null state. `Clear` and `IsNull := True` retain the last raw String in `Value`, even though inherited [`AsString`](../../TJSONValue/Properties/AsString.md) returns blank. Check `IsNull` to distinguish semantic null from an empty String.

In an object, a null-marked string serializes as `null`. In an array it incorrectly serializes as `""`, because the array checks `ValueType` instead of `IsNull`. Non-null values are quoted and passed through the limited encoder by either parent.

Assignment changes neither `Name` nor ownership. Parent-owned nodes remain borrowed and must not be freed separately.

**External references**

- [RFC 8259 section 7: Strings](https://www.rfc-editor.org/rfc/rfc8259#section-7)
- [Embarcadero `UnicodeString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.UnicodeString)
- [Free Pascal Reference Guide: string types](https://docs.freepascal.org/docs-html/current/ref/ref.html) - compatible Object Pascal string context.

<small>Created 2026-07-20</small>
