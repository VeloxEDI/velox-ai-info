---
title: AddGUID
description: Appends a braced GUID string, while the all-zero GUID triggers the empty-string null defect.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, guid, uuid]
---

```Delphi
function AddGUID(const aValue: TGUID): TJSONString;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
begin
  Values := TJSONArray.Create;
  try
    Values.AddGUID(StringToGUID('{12345678-1234-1234-1234-1234567890AB}'));
    Value := Values.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`AddGUID` appends a braced GUID string, while the all-zero GUID triggers the empty-string null defect.

### Additional Technical Info
For a nonzero `TGUID`, `AddGUID` creates an owned string node containing Delphi `GUIDToString` output, including braces. JSON has no native UUID type; this is a Velox/Deltics string convention and a consumer may require braces to be removed or a different case.

The all-zero GUID is treated as null by marking a `TJSONString` with `IsNull=True`. Because the array serializer tests its string value type before its null flag, it emits `""` rather than JSON `null`. Handle the zero-GUID policy explicitly.

The returned node is borrowed from the owning array. Do not free it; deletion, erase, content replacement or parent destruction invalidates it. Parsing a value back through `AsGUID` can raise if remote text is malformed.

**External references**

- [Embarcadero `GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - compatible GUID text context; Velox executes Delphi.
- [RFC 9562: Universally Unique IDentifiers](https://www.rfc-editor.org/rfc/rfc9562)

<small>Created 2026-07-20</small>
