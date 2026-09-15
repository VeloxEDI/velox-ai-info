---
title: dfXMLUTF8
description: "Selects the MIDAS XML packet representation with extended characters encoded as UTF-8 bytes."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, packet, xml, utf-8]
---

```Delphi
dfXMLUTF8 = 2
```

### Example

```Delphi
procedure SaveUtf8XmlPacket(const FileName: String);
begin
  DATA1.SaveToFile(FileName, dfXMLUTF8);
end;
```

### Usage

`dfXMLUTF8` selects the MIDAS XML packet representation with extended characters encoded as UTF-8 bytes.

### Additional Technical Info
`dfXMLUTF8` is ordinal 2 of [`TDataPacketFormat`](../../Types/Enumerations/TDataPacketFormat.md). Current Delphi client-dataset code maps it to MIDAS `xmlUTF8`, producing the XML packet form with extended characters represented as UTF-8.

It is normally the portable text choice when a receiver explicitly supports MIDAS XML/UTF-8. It does not turn the packet into arbitrary business XML, remove dataset metadata, normalize Unicode or guarantee that downstream code respects the declared encoding.

Select the format through this argument rather than inferring it from extension. Treat the result as bytes at a stream boundary; do not pass it through an ANSI String conversion. File and stream mutation, cursor, truncation, allocation and exception rules remain those of the chosen save method.

The example is source-reviewed only; no packet or filesystem operation ran.

**External references**

- [Embarcadero TDataPacketFormat](https://docwiki.embarcadero.com/Libraries/en/Datasnap.DBClient.TDataPacketFormat) - Delphi packet format definitions.
- [Unicode UTF-8](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/#G31703) - UTF-8 encoding definition; MIDAS schema remains Delphi-specific.

<small>Created 2026-07-15</small>
