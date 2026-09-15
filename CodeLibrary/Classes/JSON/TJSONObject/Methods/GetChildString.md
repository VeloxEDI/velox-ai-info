---
title: GetChildString
description: Returns the AsString view of a non-null nested value or the required default when either lookup path is missing or null.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, child, string]
---

```Delphi
function GetChildString(const aChildObjectName, aName, aDefault: String): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString(
    '{"customer":{"code":"C100"}}');
  try
    Value := Payload.GetChildString('customer', 'code', 'UNKNOWN');
  finally
    Payload.Free;
  end;
end;
```

### Usage

`GetChildString` returns the AsString view of a non-null nested value or the required default when either lookup path is missing or null.

### Additional Technical Info
`GetChildString` finds a child `TJSONObject`, then a non-null value inside it. Both names are compared case-insensitively and the first duplicate wins. The PascalScript declaration requires `aDefault`, which is returned for a missing, null or wrong-type outer child and for a missing or null inner value.

The inner node is not required to be a `TJSONString`. The method returns its inherited `AsString`: String nodes yield raw unquoted text, Booleans lowercase literals, numbers their Delphi-formatted text, and arrays/objects compact serialized text. Structured results therefore inherit all array/object serializer defects.

Lookups are side-effect-free because they use `FindValue`; missing paths are not inserted. A non-null but empty String returns `''`, not the default.

**External references**

- [RFC 8259 section 3: JSON values](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-20</small>
