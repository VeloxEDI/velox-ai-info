---
title: AddString
description: Adds a named non-null Unicode String node and defers quoting to the shared incomplete JSON encoder.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addstring, unicode, escaping, ownership]
---

```Delphi
function AddString(const aName: String;
  const aValue: String): TJSONString;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddString('reference', 'DEMO-1001');
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddString` adds a named non-null Unicode String node and defers quoting to the shared incomplete JSON encoder.

### Additional Technical Info
`AddString` allocates `TJSONString`, assigns `aName` and the exact Unicode `aValue`, clears its null state through the value setter and transfers it to the receiver. An empty string remains a real empty JSON string; it is distinct from the null-marked String created by [`AddNull`](AddNull.md).

The parent serializer adds quotes and runs the shared encoder. It escapes quote, backslash, backspace, tab, line feed, form feed and carriage return. It does not escape the remaining U+0000-U+001F controls (`#0..#7`, `#11`, `#14..#31`), so such input can produce invalid JSON. It also does not normalize Unicode or replace unmatched UTF-16 surrogate code units.

Object field names receive no encoder at all. Even if `aValue` is safe, an `aName` containing quote, backslash or a control character can break object output. Arrays ignore child names.

The returned `TJSONString` is borrowed and parent-owned. Its `Value` remains mutable; removal, erase/reload or parent destruction frees it. Allocation or insertion errors propagate, with a possible leak on final list insertion failure.

**External references**

- [RFC 8259 section 7: Strings and escaping](https://www.rfc-editor.org/rfc/rfc8259#section-7)
- [Embarcadero Unicode in RAD Studio](https://docwiki.embarcadero.com/RADStudio/Florence/en/Unicode_in_RAD_Studio)
- [Free Pascal Unicode support](https://www.freepascal.org/docs-html/ref/refsu9.html) - dialect context; Velox uses Delphi UnicodeString behavior.

<small>Created 2026-07-15</small>
