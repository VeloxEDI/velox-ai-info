---
title: TJSONString
description: Represents raw mutable Unicode text whose quoting and incomplete JSON escaping occur only in a parent container.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, string, unicode, escaping]
---

```Delphi
TJSONString = class(TJSONValue)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
begin
  Text := TJSONString.Create;
  try
    Text.Value := 'Ready';
    Value := Text.AsString;  // Ready, without JSON quotation marks.
  finally
    Text.Free;
  end;
end;
```

### Usage

`TJSONString` represents raw mutable Unicode text whose quoting and incomplete JSON escaping occur only in a parent container.

### Additional Technical Info
`TJSONString` stores one Delphi Unicode `String` and reports `ValueType = jsString`. The inherited virtual [`Create`](TJSONValue/Methods/Create.md) constructor creates a non-null node whose [`Value`](TJSONString/Properties/Value.md) is empty. A directly created node is script-owned; a string node obtained from an object or array is borrowed and owned by its parent.

`Value` and inherited `AsString` expose raw, unquoted text. `AsString = 'Ready'` does not mean the complete JSON document `"Ready"`; quotation and escaping are applied only when an object or array serializes the child. `TJSONString` is also used by Velox JSON helpers for dates, times, GUIDs and enumeration names, with interpretation supplied by inherited conversion properties.

#### Escaping and parser behavior

The parent encoder escapes quotation mark, reverse solidus, backspace, tab, line feed, form feed and carriage return. Escaping `/` is optional and deliberately omitted. However, the other control characters U+0000 through U+001F are emitted raw, contrary to RFC 8259, and UTF-16 surrogate pairing is not validated. Validate or sanitize untrusted strings before producing interoperable JSON.

The Deltics reader decodes the named escapes above, but its `\uXXXX` branch is unfinished: it consumes `u` and then appends the four hexadecimal characters literally instead of reconstructing the Unicode code point. A parsed string containing Unicode escapes therefore does not round-trip to its intended value.

Object field names are stored in each child's inherited `Name`, not in this `Value`. The object serializer writes those names without any escaping, a separate defect that applies even when the child is a `TJSONString`.

#### Empty and null strings

An empty non-null String serializes as `""`. `Clear` or `IsNull := True` retains the raw payload but makes inherited `AsString` blank. An object checks `IsNull` and emits `null`; an array checks only `ValueType` and incorrectly emits `""`, making null indistinguishable from an empty string. Use a real `TJSONNull` in arrays.

The PascalScript `NotNull` property is incorrectly bound to `IsNull` and returns the same value. Inherited `CopyFrom` assumes another `TJSONString` without a runtime type check; a wrong-class call is especially unsafe because it treats unrelated field memory as a managed String. `IsEqual` compares type, case-sensitive name and `AsString`, so cleared strings compare as empty regardless of retained payload.

**External references**

- [RFC 8259 section 7: Strings](https://www.rfc-editor.org/rfc/rfc8259#section-7)
- [Embarcadero `UnicodeString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.UnicodeString)
- [Free Pascal Reference Guide: string types](https://docs.freepascal.org/docs-html/current/ref/ref.html) - compatible Object Pascal string context; Velox executes the traced Delphi implementation.

<small>Created 2026-07-20</small>
