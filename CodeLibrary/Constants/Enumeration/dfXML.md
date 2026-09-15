---
title: dfXML
description: "Selects the MIDAS XML packet representation that escapes extended characters instead of writing them as UTF-8 bytes."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, packet, xml, escaping]
---

```Delphi
dfXML = 1
```

### Example

```Delphi
procedure SaveEscapedXmlPacket(const FileName: String);
begin
  DATA1.SaveToFile(FileName, dfXML);
end;
```

### Usage

`dfXML` selects the MIDAS XML packet representation that escapes extended characters instead of writing them as UTF-8 bytes.

### Additional Technical Info
`dfXML` is ordinal 1 of [`TDataPacketFormat`](../../Types/Enumerations/TDataPacketFormat.md). Current Delphi client-dataset code maps it to MIDAS `xmlON`: an XML packet in which extended characters are represented with escape sequences rather than UTF-8 bytes.

This remains the MIDAS data-packet schema, including dataset metadata; it is not generic row-oriented XML and is not selected merely by using a `.xml` filename. The receiving system must understand this packet dialect and character representation.

Choose [`dfXMLUTF8`](dfXMLUTF8.md) when the consumer supports UTF-8 packet bytes. Do not parse/modify the output with string replacements without preserving its declaration, escapes, metadata and binary-field encoding.

File saves can replace/truncate a destination; stream saves begin at the existing cursor and do not truncate stale trailing data. Bound dataset size and handle partial output/errors according to the exact save method. The example is source-reviewed only; no XML/file was written.

**External references**

- [Embarcadero TDataPacketFormat](https://docwiki.embarcadero.com/Libraries/en/Datasnap.DBClient.TDataPacketFormat) - exact Delphi packet choices.
- [W3C XML](https://www.w3.org/TR/xml/) - XML syntax context; the MIDAS packet schema is product-specific.

<small>Created 2026-07-15</small>
