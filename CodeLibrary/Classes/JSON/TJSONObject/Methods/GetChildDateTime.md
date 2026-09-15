---
title: GetChildDateTime
description: Converts a non-null value one object level down from ISO 8601 or returns the required default for a missing or null path.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, child, datetime]
---

```Delphi
function GetChildDateTime(const aChildObjectName, aName: String;
  const aDefault: TDateTime): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString(
    '{"audit":{"created":"2026-07-20T04:00:00Z"}}');
  try
    Value := Payload.GetChildDateTime('audit', 'created', 0);
  finally
    Payload.Free;
  end;
end;
```

### Usage

`GetChildDateTime` converts a non-null value one object level down from ISO 8601 or returns the required default for a missing or null path.

### Additional Technical Info
`GetChildDateTime` finds an actual child `TJSONObject`, then finds one named value inside it. Both comparisons are case-insensitive and select the first duplicate. The required `aDefault` is returned when the child is missing, null or not an object, or when the inner value is missing or null.

A present non-null value is converted with `ISO8601ToDate(value.AsString, True)`, requesting a UTC result. The method does not verify `ValueType` first. Invalid ISO text, an incompatible scalar or malformed structured output raises a conversion exception rather than returning the default.

The lookup is observational: it uses `FindValue` and does not create missing null fields. `0` is only a default chosen by the caller; a non-null value that converts to Delphi date zero is returned normally.

**External references**

- [Embarcadero `ISO8601ToDate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.ISO8601ToDate)
- [Free Pascal `ISO8601ToDate`](https://www.freepascal.org/docs-html/current/rtl/dateutils/iso8601todate.html) - compatible conversion context; Velox executes the traced Delphi implementation.

<small>Created 2026-07-20</small>
