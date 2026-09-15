---
title: FindObject
description: Finds the first object whose case-insensitive named field converts to the requested GUID.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, find, object, guid]
---

```Delphi
function FindObject(const aValueName: String; const aValue: TGUID;
  var aObject: TJSONObject): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
  Found: TJSONObject;
  Id: TGUID;
begin
  Values := TJSONArray.Create;
  try
    Values.LoadFromString('[{"id":"{12345678-1234-1234-1234-1234567890AB}"}]');
    Id := StringToGUID('{12345678-1234-1234-1234-1234567890AB}');
    Found := nil;
    if Values.FindObject('id', Id, Found) then
      Value := Found.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`FindObject` finds the first object whose case-insensitive named field converts to the requested GUID.

### Additional Technical Info
`FindObject` scans from index zero, skips non-object items and selects the first `TJSONObject` containing `aValueName` whose field's `AsGUID` equals `aValue` byte-for-byte. Object field lookup is case-insensitive.

On success it returns `True` and assigns the actual array-owned object to `aObject`; the result is borrowed and becomes invalid after array mutation/destruction affecting that node. On an ordinary no-match result it assigns `nil` and returns `False`, replacing any prior value in the output variable.

The named field must convert successfully through Delphi `StringToGUID`. Malformed non-null text raises rather than producing `False`. A present null field converts to the all-zero GUID and can match an all-zero `aValue`. The method does not search nested arrays/objects and does not compare arbitrary strings.

**External references**

- [Embarcadero `StringToGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringToGUID)
- [Free Pascal `StringToGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/stringtoguid.html) - compatible GUID conversion context.
- [RFC 9562: UUIDs](https://www.rfc-editor.org/rfc/rfc9562)

<small>Created 2026-07-20</small>
