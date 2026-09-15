---
title: SaveToStream
description: Serializes the tree through a buffered writer at the borrowed stream's current cursor without clearing or truncating existing bytes.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, stream, save, encoding, bom, partial-output]
---

```Delphi
procedure SaveToStream(Stream: TStream);
```

### Example

```Delphi
procedure ReplaceStreamXml(Xml: TNativeXML; Output: TStream);
begin
  if (Xml = nil) or (Output = nil) then Exit;

  Output.Position := 0;
  Output.Size := 0;
  Xml.SaveToStream(Output);
end;
```

### Usage

`SaveToStream` serializes the tree through a buffered writer at the borrowed stream's current cursor without clearing or truncating existing bytes.

### Additional Technical Info
`SaveToStream` serializes the current top-level node list through a 256-byte NativeXML buffered writer. `Stream` is borrowed and not freed.

Writing begins at the destination's current Position. The method does not rewind, clear or truncate it. If new output is shorter than existing content, stale trailing bytes remain unless the caller truncates first. The final cursor is after emitted bytes. A nil, nonwritable or incompatible stream fails through native stream operations.

#### Encoding and BOM behavior

The document's internal external-encoding state selects output:

| State | Emitted BOM |
|---|---|
| ANSI/code-page | none |
| UTF-8 | none, even when loaded input had a UTF-8 BOM |
| UTF-16 little endian | required two-byte BOM |
| UTF-16 big endian | required two-byte BOM |

Fresh documents default to UTF-8/no BOM. Successful LoadFromStream changes encoding/code page from the input. New and Clear preserve it, even though their recreated declaration says utf-8. Unsupported internal encoding follows a debug-failure/early-exit path instead of a guaranteed exception; because debug configuration is not exposed, this can produce no output without a script-visible diagnostic.

The writer serializes all top-level nodes in order. The public scripting surface does not expose format/encoding setters, so the caller cannot request pretty printing or correct a retained encoding directly.

#### Failure state

Output is nontransactional. Stream exceptions, invalid tree data or memory failures can leave a prefix written. The writer is freed in finally and its destructor flushes any remaining buffered bytes, so cleanup can extend partial output or raise another write error. The method does not restore destination Position.

The example is source-reviewed only; no bytes were written.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream buffered serializer lineage.
- [W3C XML encoding detection](https://www.w3.org/TR/xml/#charencoding) - BOM and declaration rules.

<small>Created 2026-07-15</small>
