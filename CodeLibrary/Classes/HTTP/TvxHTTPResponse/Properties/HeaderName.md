---
title: HeaderName
description: Parses the field name from one zero-based physical raw response-header entry.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, header, name]
---

```Delphi
property HeaderName[const aIndex: Integer]: String read;
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
    if SameText(Http.Response.HeaderName[I], 'Warning') then
      Value := Value + Http.Response.HeaderByIndex[I] + #13#10;
end;
```

### Usage

`HeaderName` parses the field name from one zero-based physical raw response-header entry.

### Additional Technical Info
`HeaderName[index]` returns the name parsed before the colon in the zero-based [`HeaderByIndex`](HeaderByIndex.md) entry. Normal field-name comparison is case-insensitive, but this property preserves the stored spelling. A physical continuation or malformed line without a parsed name returns `''`.

Valid indexes are `0` through [`HeaderCount`](HeaderCount.md) `- 1`. Out-of-range access raises before a value can be returned. Indexes are tied to the current raw list and must not be reused after another request.

Repeated field names appear at multiple positions. To recover the exact line/value at each of those positions, use `HeaderByIndex[index]`. [`HeaderValue`](HeaderValue.md)`[index]` does not preserve duplicate occurrence identity because it takes this name and then performs a first-match named lookup.

Names and lines are remote input. Compare against an allowlist for machine behavior, handle an empty name explicitly and redact sensitive matching lines before logging. The raw list can be stale after failure before new headers are received.

**External references**

- [RFC 9110 section 5.1: Field names](https://www.rfc-editor.org/rfc/rfc9110#section-5.1)
- [Embarcadero `TStrings.Names`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStrings.Names)
- [Free Pascal `TStrings.Names`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.names.html) - compatible name/value-list context; Velox executes Indy/Delphi behavior.

<small>Created 2026-07-20</small>
