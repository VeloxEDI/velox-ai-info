---
title: AddString
description: Appends an owned JSON string using Deltics' incomplete control-character escaping.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, string, escaping]
---

```Delphi
function AddString(const aValue: String): TJSONString;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.AddString('Quoted "value" and path C:\Temp');
    Value := Values.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`AddString` appends an owned JSON string using Velox' incomplete control-character escaping.

### Additional Technical Info
`AddString` creates an owned `TJSONString`, stores the exact Delphi string and appends it. Serialization surrounds the value with quotes and escapes `"`, backslash, backspace, tab, line feed, form feed and carriage return. Forward slash is intentionally left unescaped, which JSON permits.

The serializer does not escape the other U+0000-U+001F controls (`#0`-`#7`, `#11`, and `#14`-`#31`). Those raw characters violate RFC 8259 string grammar and can make the output invalid or unsafe for line-oriented logging. Validate/reject those controls before adding externally sourced text.

The returned node is a borrowed mutable reference owned by the array. It becomes invalid after removal, erase, replacement or parent destruction. A value that looks like JSON is still emitted as a quoted string; use `AddText`, `AddArray` or `AddObject` for nested structure.

**External references**

- [RFC 8259 section 7: Strings](https://www.rfc-editor.org/rfc/rfc8259#section-7)

<small>Created 2026-07-20</small>
