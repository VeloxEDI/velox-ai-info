---
title: OptInteger
description: Reads a present Boolean ordinal or signed 32-bit integer and uses the required default only for a missing or null field.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, optional, integer]
---

```Delphi
function OptInteger(const aName: String;
  const aDefault: Integer): Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"quantity":2}');
  try
    Value := Payload.OptInteger('quantity', 0);
  finally
    Payload.Free;
  end;
end;
```

### Usage

`OptInteger` reads a present Boolean ordinal or signed 32-bit integer and uses the required default only for a missing or null field.

### Additional Technical Info
`OptInteger` finds the first field whose name matches case-insensitively. It returns the required default when no field exists or the node is null; lookup does not create a missing value.

A Boolean converts to `1` or `0`. A number or String is converted with Delphi `StrToInt`, so the result is signed 32-bit. A larger `TJSONInteger.Value`, fractional number, malformed numeric String or structured node raises instead of returning `aDefault`.

The method is conversion-based rather than type-strict. A numeric String can succeed, and a present non-null zero is returned normally. Duplicate names select the first physical occurrence.

Use a `TJSONValue.AsInt64`/`TJSONInteger.Value` path when the source can exceed 32-bit range; this method cannot return Int64.

**External references**

- [Embarcadero `StrToInt`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToInt)
- [Free Pascal `StrToInt`](https://www.freepascal.org/docs-html/rtl/sysutils/strtoint.html) - compatible conversion context.

<small>Created 2026-07-20</small>
