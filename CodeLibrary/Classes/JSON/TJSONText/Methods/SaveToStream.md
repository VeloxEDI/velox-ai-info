---
title: SaveToStream
description: Writes compact or formatted UTF-8 bytes without a BOM at the borrowed stream's current position, without clearing or truncating it.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, savetostream, utf8, stream, compact]
---

```Delphi
procedure SaveToStream(const aStream: TStream;
  const aCompact: Boolean);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
  Output: TMemoryStream;
begin
  Document := TJSONObject.Create;
  Output := TMemoryStream.Create;
  try
    Document.AddString('reference', 'DEMO-1001');
    Document.SaveToStream(Output, True);
    Value := Output.Size;
  finally
    Output.Free;
    Document.Free;
  end;
end;
```

### Usage

`SaveToStream` writes compact or formatted UTF-8 bytes without a BOM at the borrowed stream's current position, without clearing or truncating it.

### Additional Technical Info
`SaveToStream` selects compact `AsString` when `aCompact=True` and formatted [`AsDisplayText`](../Properties/AsDisplayText.md) otherwise, encodes the complete String with Delphi `TEncoding.UTF8.GetBytes`, then calls `aStream.Write(bytes, 0, length)`. The native false default is absent from PascalScript, so both arguments are required.

The stream is borrowed and remains open. Bytes are written at its current position. The method does not seek, clear, truncate, add a UTF-8 BOM or restore position. Overwriting a longer existing stream with shorter JSON leaves the old tail unless the caller truncates separately; appending is possible by positioning at the end.

It uses `Write`, not `WriteBuffer`, and ignores the returned byte count. A stream implementation that reports a short write without raising can silently receive truncated JSON. Explicit stream exceptions propagate. The method does not flush a file/device stream.

Compact/display selection can affect more than whitespace. A null-marked String in an array becomes `""` in compact output but `null` in display output; an empty object is invalid `}` compact but complete when displayed. Both forms preserve unescaped field names, incomplete control escaping, duplicate order and numeric locale/non-finite hazards.

Nil or non-writable streams fail. The object graph, complete output String and UTF-8 byte array coexist, and repeated display-string concatenation adds allocation cost. The receiver and destination must not be mutated concurrently.

**External references**

- [Embarcadero `TStream.Write`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Write)
- [Free Pascal `TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html) - compatible short-write contract context.
- [Embarcadero `TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding.GetBytes)
- [RFC 8259 section 8.1: Character encoding](https://www.rfc-editor.org/rfc/rfc8259#section-8.1)

<small>Created 2026-07-15</small>
