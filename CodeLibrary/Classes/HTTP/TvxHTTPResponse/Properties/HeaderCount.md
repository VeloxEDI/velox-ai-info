---
title: HeaderCount
description: Returns the number of physical entries in the current Indy raw response-header list.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, header, count]
---

```Delphi
property HeaderCount: Integer read;
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
    Value := Value + Http.Response.HeaderName[I] + #13#10;
end;
```

### Usage

`HeaderCount` returns the number of physical entries in the current Velox raw response-header list.

### Additional Technical Info
`HeaderCount` returns `FHTTP.Response.RawHeaders.Count`. It counts physical list entries rather than unique field names. Repeated fields each count, continuation lines can count independently and fields read from chunked trailers are appended to the same list.

Use zero-based indexes from `0` to `HeaderCount - 1` with [`HeaderByIndex`](HeaderByIndex.md) or [`HeaderName`](HeaderName.md). When the count is zero, a Pascal `for I := 0 to HeaderCount - 1` loop performs no iterations. Every indexed accessor raises for an index outside the current range.

The count says nothing about validity, uniqueness, sensitivity or whether a field was present in the initial header section rather than trailers. For a single case-insensitive named value use [`Header`](Header.md), while remembering that it selects only the first occurrence.

The raw list belongs to the associated Indy response. Velox does not clear it at the start of a request, so this count and the indexed entries can remain from the previous response if setup fails before new headers are retrieved.

**External references**

- [RFC 9110 section 5: Fields](https://www.rfc-editor.org/rfc/rfc9110#section-5)
- [Embarcadero `TStrings.Count`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStrings.Count)
- [Free Pascal `TStrings.Count`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.count.html) - compatible list context; Velox executes Indy/Delphi behavior.

<small>Created 2026-07-20</small>
