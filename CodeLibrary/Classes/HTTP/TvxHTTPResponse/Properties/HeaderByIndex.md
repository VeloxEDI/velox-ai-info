---
title: HeaderByIndex
description: Returns one zero-based physical raw response-header line including its field name and colon.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, header, index]
---

```Delphi
property HeaderByIndex[const aIndex: Integer]: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  I: Integer;
  Lines: string;
begin
  Http.Get('https://api.example.invalid/v1/status');
  Lines := '';
  for I := 0 to Http.Response.HeaderCount - 1 do
    Lines := Lines + Http.Response.HeaderByIndex[I] + #13#10;
  Value := Lines;
end;
```

### Usage

`HeaderByIndex` returns one zero-based physical raw response-header line including its field name and colon.

### Additional Technical Info
`HeaderByIndex[index]` returns the exact string stored at the zero-based position in Indy's response `RawHeaders` list. A normal entry includes the field name, colon and value. The list can also contain physical continuation lines and fields appended from chunked trailers.

Valid indexes are `0` through [`HeaderCount`](HeaderCount.md) `- 1`. A negative index or an index at or above the count raises a Delphi string-list range exception; the accessor does not return an empty sentinel. Re-read `HeaderCount` for the same response before iterating and do not retain indexes across requests.

Unlike [`Header`](Header.md), this property preserves repeated field occurrences and physical ordering. Use it when raw diagnostic fidelity matters. Use [`HeaderName`](HeaderName.md) to parse the name at the same position. `HeaderValue` is not the exact indexed counterpart for duplicates because it performs a second name-based first-value lookup.

Do not emit all returned lines to ordinary logs without redaction. Raw response fields can contain authentication challenges, cookies, correlation identifiers, personal data and attacker-controlled control content. The complete list can also remain stale after a pre-terminal setup failure.

**External references**

- [RFC 9110 section 5: Fields](https://www.rfc-editor.org/rfc/rfc9110#section-5)
- [Embarcadero `TStrings.Strings`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStrings.Strings)
- [Free Pascal `TStrings.Strings`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.strings.html) - compatible indexed-list context; Velox executes Indy/Delphi behavior.

<small>Created 2026-07-20</small>
