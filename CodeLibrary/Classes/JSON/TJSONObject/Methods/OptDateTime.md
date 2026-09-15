---
title: OptDateTime
description: Converts a present non-null field from ISO 8601 to UTC and uses the required default only for absence or null.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, optional, datetime]
---

```Delphi
function OptDateTime(const aName: String;
  const aDefault: TDateTime): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString(
    '{"created":"2026-07-20T04:00:00Z"}');
  try
    Value := Payload.OptDateTime('created', 0);
  finally
    Payload.Free;
  end;
end;
```

### Usage

`OptDateTime` converts a present non-null field from ISO 8601 to UTC and uses the required default only for absence or null.

### Additional Technical Info
`OptDateTime` finds the first case-insensitive field without mutating the object. It returns the required `aDefault` when the field is missing or its node is null.

A present non-null node is converted with `ISO8601ToDate(value.AsString, True)`, requesting UTC adjustment. No `ValueType` check is made first: a JSON String is typical, but any node whose `AsString` is accepted can succeed.

Invalid ISO text or incompatible structured/scalar output raises a conversion exception. The default is not an exception fallback. Validate remote text separately when a malformed field must be treated like absence.

Duplicate names select the first physical value. A non-null timestamp that converts to Delphi zero is returned as zero and is not replaced by the default.

**External references**

- [Embarcadero `ISO8601ToDate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.ISO8601ToDate)
- [Free Pascal `ISO8601ToDate`](https://www.freepascal.org/docs-html/current/rtl/dateutils/iso8601todate.html) - compatible ISO conversion context.

<small>Created 2026-07-20</small>
