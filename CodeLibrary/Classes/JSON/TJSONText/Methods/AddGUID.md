---
title: AddGUID
description: Adds a named braced GUID String or a null-marked String for the all-zero GUID, with container-dependent null output.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addguid, guid, 'null', ownership]
---

```Delphi
function AddGUID(const aName: String;
  const aValue: TGUID): TJSONString;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddGUID('id',
      StringToGUID('{11111111-2222-3333-4444-555555555555}'));
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddGUID` adds a named braced GUID String or a null-marked String for the all-zero GUID, with container-dependent null output.

### Additional Technical Info
For a nonzero GUID, `AddGUID` creates a `TJSONString`, assigns `aName`, uses Delphi `GUIDToString` and transfers the node to the receiver. The serialized value includes braces and is quoted as JSON text; casing follows the RTL formatter.

The all-zero GUID is a sentinel. Instead of storing its textual form or constructing `TJSONNull`, the method creates an empty String node and sets `IsNull=True`. Objects emit `null`. Arrays reached through this ancestor emit `""` in compact form because their compact serializer branches on String type, while display form tests null first and emits `null`.

The returned String is a borrowed, parent-owned child. It becomes invalid when removed, erased/replaced or when its parent is freed. The method compares all 16 GUID bytes, so only the exact zero structure receives null treatment.

No GUID parsing occurs here; the caller must already provide `TGUID`. Conversion errors in a preceding `StringToGUID` call happen before this method. Allocation or insertion errors propagate, with a possible leak if final owning-list insertion fails.

**External references**

- [Embarcadero `GUIDToString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.GUIDToString)
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - compatible braced GUID context.
- [RFC 8259 section 7: Strings](https://www.rfc-editor.org/rfc/rfc8259#section-7)

<small>Created 2026-07-15</small>
