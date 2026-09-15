---
title: GetChildInteger
description: Reads a signed 32-bit nested integer or Boolean ordinal and uses the required default only for a missing or null path.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, child, integer]
---

```Delphi
function GetChildInteger(const aChildObjectName, aName: String;
  const aDefault: Integer): Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString(
    '{"paging":{"page":2}}');
  try
    Value := Payload.GetChildInteger('paging', 'page', 1);
  finally
    Payload.Free;
  end;
end;
```

### Usage

`GetChildInteger` reads a signed 32-bit nested integer or Boolean ordinal and uses the required default only for a missing or null path.

### Additional Technical Info
`GetChildInteger` uses side-effect-free, case-insensitive first-match lookup at two levels. The required default is returned when the outer value is missing, null or not an object, or when the inner value is missing or null.

A present Boolean converts to `1` or `0`. A present JSON number or String is converted with Delphi `StrToInt`, so the result is limited to signed 32-bit `Integer`. Fractional text, an out-of-range Int64, incompatible structured values and malformed strings raise rather than returning `aDefault`.

The method does not enforce a JSON integer node: a numeric String can succeed, while a Double such as `2.0` usually fails because its text contains a decimal point. Duplicate names resolve to the first physical field at each level.

**External references**

- [Embarcadero `StrToInt`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToInt)
- [Free Pascal `StrToInt`](https://www.freepascal.org/docs-html/rtl/sysutils/strtoint.html) - compatible conversion context.

<small>Created 2026-07-20</small>
