---
title: CreateFromStream
description: Uses a required ignored receiver to parse one object or array from a borrowed stream and return a separate caller-owned tree.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, createfromstream, parsing, stream, ownership]
---

```Delphi
function CreateFromStream(const aStream: TStream): TJSONText;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Factory, Parsed: TJSONText;
  Input: TStringStream;
begin
  Factory := TJSONObject.Create;
  Input := TStringStream.Create('["first",2]');
  try
    Parsed := Factory.CreateFromStream(Input);
    try
      if Assigned(Parsed) then
        Value := Parsed.AsDisplayText;
    finally
      Parsed.Free;
    end;
  finally
    Input.Free;
    Factory.Free;
  end;
end;
```

### Usage

`CreateFromStream` uses a required ignored receiver to parse one object or array from a borrowed stream and return a separate caller-owned tree.

### Additional Technical Info
The native declaration is a class function, but the Velox compiler declaration omits `class` and runtime registration uses the ordinary method bridge. PascalScript requires a non-nil receiver. Use a variable whose compile-time type is `TJSONText`, as above, to avoid descendant names shadowing the ancestor method. The native function ignores that receiver and returns a separate tree.

`aStream` is borrowed and read from its current position. A Unicode decorator detects UTF-8, UTF-16LE/BE and UTF-32LE/BE BOMs; BOM-less input defaults to UTF-8. Detection does not imply standards-compliant decoding: continuation-byte ranges are not validated, the four-byte UTF-8 calculation is wrong, UTF-16 surrogate arithmetic is wrong and decoded UTF-32/non-BMP values are cast directly to one 16-bit `Char`. Supplementary-plane characters and malformed sequences can be corrupted rather than rejected consistently.

The underlying stream is not freed, and its position advances past the parsed first value. Nil input fails while the reader attempts to inspect the missing stream.

An object or array result is caller-owned and must be freed. Empty/whitespace-only input returns nil. A scalar first value is allocated, then the checked `as TJSONText` cast raises; because the temporary scalar is not retained in a cleanup variable, that scalar leaks. Parse, decoding, allocation and stream errors propagate with their original exception type.

Parsing stops after one value and ignores trailing content. Arrays accept missing commas, a trailing comma and EOF without `]`; objects are stricter about separators/closing. `\uXXXX` is not decoded, exponent-only numbers are routed to failing Integer conversion and decimals use process-locale `StrToFloat`.

The method constructs the complete tree in memory. Do not use unbounded hostile streams without independent size/resource controls.

**External references**

- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Position)
- [Free Pascal `TStream.Position`](https://www.freepascal.org/docs-html/rtl/classes/tstream.position.html) - compatible current-position context.
- [RFC 8259 section 9: Parsers](https://www.rfc-editor.org/rfc/rfc8259#section-9)

<small>Created 2026-07-15</small>
