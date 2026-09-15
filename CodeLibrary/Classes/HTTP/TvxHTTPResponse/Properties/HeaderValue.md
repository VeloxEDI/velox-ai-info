---
title: HeaderValue
description: Resolves an indexed line's name back to the first matching response-field value rather than that occurrence's value.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, header, value, duplicate]
---

```Delphi
property HeaderValue[const aIndex: Integer]: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  I: Integer;
begin
  Http.Get('https://api.example.invalid/v1/status');
  Value := '';
  for I := 0 to Http.Response.HeaderCount - 1 do
    if Http.Response.HeaderName[I] <> '' then
      Value := Value + Http.Response.HeaderName[I] + '=' +
        Http.Response.HeaderValue[I] + #13#10;
end;
```

### Usage

`HeaderValue` resolves an indexed line's name back to the first matching response-field value rather than that occurrence's value.

### Additional Technical Info
`HeaderValue[index]` is not simply the value portion of [`HeaderByIndex`](HeaderByIndex.md). The implementation first obtains `RawHeaders.Names[index]`. If that name is nonempty, it calls the case-insensitive `RawHeaders.Values[name]` lookup and returns the **first** matching named value; otherwise it returns `''`.

This two-step behavior matters for repeated fields. Every indexed occurrence of the same name returns the first occurrence's value, even when later physical lines contain different values. To retain duplicate order and exact occurrence values, parse `HeaderByIndex[index]` or apply a field-specific combination rule. Do not assume comma joining is valid for every HTTP field.

Continuation or malformed physical entries whose parsed name is empty return `''`. A field genuinely containing an empty value is therefore indistinguishable from those cases through this property. An out-of-range index raises while obtaining the name.

Valid indexes are zero through [`HeaderCount`](HeaderCount.md) minus one. Header content is remote, potentially sensitive input and can be stale after a failure before a new response is received. Validate expected syntax and redact before logging.

**External references**

- [RFC 9110 section 5.2: Field lines and combined field values](https://www.rfc-editor.org/rfc/rfc9110#section-5.2)
- [Embarcadero `TStrings.Values`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStrings.Values)
- [Free Pascal `TStrings.Values`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.values.html) - compatible name/value-list context; Velox executes Indy/Delphi behavior.

<small>Created 2026-07-20</small>
