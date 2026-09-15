---
title: SaveToFile
description: Creates or truncates a process-accessible file before serializing the current XML tree with remembered output encoding.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, file, save, truncate, filesystem, partial-output]
---

```Delphi
procedure SaveToFile(const FileName: string);
```

### Example

```Delphi
procedure SaveDocument(Xml: TNativeXML; const FileName: String);
begin
  if Xml = nil then Exit;

  Xml.SaveToFile(FileName);
end;
```

### Usage

`SaveToFile` creates or truncates a process-accessible file before serialising the current XML tree with remembered output encoding.

### Additional Technical Info
`SaveToFile` constructs a `TFileStream` with `fmCreate`, calls [`SaveToStream`](SaveToStream.md), and closes the file in a finally block. `fmCreate` creates a missing file or truncates an existing file before XML serialization starts.

The path executes under the Velox process identity. A caller can overwrite any accessible file, so treat configuration/user-derived paths as an authority boundary. The method creates no parent directories and does not provide atomic replacement, backup or temporary-file staging.

Because truncation happens first, a serialization failure destroys the previous file and can leave zero bytes or a partial XML prefix. Buffered-writer destruction can flush a final partial chunk while unwinding. For important output, save to a controlled temporary path, verify it, then use an approved atomic promotion process outside this method.

Encoding comes from the document's internal output state, normally compact UTF-8 without BOM for a fresh object or the encoding remembered from a successful load. New/Clear do not reset that state and can leave a declaration/byte mismatch after non-UTF-8 input.

The method does not check schema validity or require a nonempty legal root in the exposed configuration. Ensure Root.Name and content are correct before opening the target because validation after truncation is too late.

The example is source-reviewed only; no filesystem was accessed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream file-save implementation lineage.
- [W3C XML 1.0](https://www.w3.org/TR/xml/) - serialized XML document requirements.

<small>Created 2026-07-15</small>
