---
title: SaveToFile
description: Serializes the complete tree as compact or formatted UTF-8 without a BOM and non-atomically creates or truncates the target file.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, savetofile, utf8, file, compact]
---

```Delphi
procedure SaveToFile(const aFileName: String;
  const aCompact: Boolean);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddString('reference', 'DEMO-1001');
    Document.SaveToFile('C:\Fictional\Outbound\payload.json', True);
    Value := 'JSON written';
  finally
    Document.Free;
  end;
end;
```

### Usage

`SaveToFile` serializes the complete tree as compact or formatted UTF-8 without a BOM and non-atomically creates or truncates the target file.

### Additional Technical Info
`SaveToFile` builds an in-memory UTF-8 `TStringStream` without a BOM, calls [`SaveToStream`](SaveToStream.md), then uses `TCustomMemoryStream.SaveToFile`. That terminal creates the destination with `fmCreate`, replacing/truncating an existing file and writing the complete memory stream from its start.

The native `aCompact` default is false, but the PascalScript importer does not preserve it; scripts must supply the Boolean. `True` selects inherited compact `AsString`. `False` selects [`AsDisplayText`](../Properties/AsDisplayText.md), which inserts CRLF/indentation and can differ semantically for null-marked array Strings.

Output is UTF-8 without a preamble. Compact empty objects produce invalid `}`; formatted empty objects are complete. Both forms leave object names unescaped and retain the incomplete String-control encoder, duplicate names/order, locale-sensitive Double output and non-finite-number risk.

The write is not atomic: it does not create a temporary file and rename it. A serialization, create, disk-full, permission or write error propagates; after `fmCreate`, failure can leave a missing, empty or partial destination. No parent directories are created.

`aFileName` is interpreted in the Velox process/service account context with no method-level sandbox or allow-list. Use trusted configured locations and do not pass arbitrary external input. The document exists simultaneously as the object graph, a complete Delphi String and UTF-8 bytes, so peak memory can substantially exceed output size.

**External references**

- [Embarcadero `TCustomMemoryStream.SaveToFile`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCustomMemoryStream.SaveToFile)
- [Free Pascal `TMemoryStream.SaveToFile`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.savetofile.html) - analogous replacement context.
- [Embarcadero `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding.UTF8)
- [RFC 8259 section 8.1: Character encoding](https://www.rfc-editor.org/rfc/rfc8259#section-8.1)

<small>Created 2026-07-15</small>
