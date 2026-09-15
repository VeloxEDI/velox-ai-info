---
title: ContentLength
description: Exposes a provisional script-Integer content length that automatic sending discards and recalculates from encoded text or stream size.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content-length, integer, framing]
---

```Delphi
property ContentLength: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.ContentString := 'ready';
    Value := Response.ContentLength; { provisional character count: 5 }
  end;
end;
```

### Usage

`ContentLength` exposes a provisional script-Integer content length that automatic sending discards and recalculates from encoded text or stream size.

### Additional Technical Info
The native WebBroker/Indy property is `Int64`; Velox exposes it through a PascalScript `Integer` helper. A write accepts only the script integer range. A read narrows the current native value and can raise `ERangeError` when a stream or native producer has established a size outside that range.

During script execution the value is provisional:

- assigning [`ContentString`](ContentString.md) sets it to the Unicode string's character count, not its encoded byte count;
- assigning [`Content`](Content.md) sets it to the stream's native `Size`; and
- a script can assign another integer, including negative values.

Immediately before the normal response is sent, `TIdHTTPAppResponse.SendResponse` unconditionally resets the native value to `-1`. Indy then calculates the actual field from the encoded text byte count or stream `Size`, or uses zero for HEAD/1xx/204/304. Consequently a script assignment does not constrain or truncate automatic response output and should not be used as a size-enforcement mechanism.

Indy gives nonempty text priority over the stream when calculating and writing. If neither body source is present for an ordinary response, it generates a small HTML status body and calculates that length. If a transfer coding is configured, HTTP framing rules can omit/ignore Content-Length.

Do not add a separate `Content-Length` custom header: duplicate or conflicting framing is unsafe. Bound the data before storing it, choose one body source, and let automatic sending calculate the field. Reading this property does not measure the final encoded wire length. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.ContentLength`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.ContentLength)
- [RFC 9110 section 8.6: Content-Length](https://www.rfc-editor.org/rfc/rfc9110#section-8.6)
- [RFC 9112 section 6.3: Message Body Length](https://www.rfc-editor.org/rfc/rfc9112#section-6.3)

<small>Created 2026-07-15</small>
