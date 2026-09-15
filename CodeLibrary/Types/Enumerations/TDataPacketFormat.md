---
title: TDataPacketFormat
description: Selects binary, escaped XML or UTF-8 XML serialization for a complete client-dataset data packet.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, dataset, packet, binary, xml, utf-8]
---

```Delphi
TDataPacketFormat = (dfBinary, dfXML, dfXMLUTF8)
```

### Example

```Delphi
procedure SavePacket(const FileName: String);
begin
  DATA1.SaveToFile(FileName, dfXMLUTF8);
end;
```

### Usage

`TDataPacketFormat` selects binary, escaped XML or UTF-8 XML serialisation for a complete client-dataset data packet.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `dfBinary` | 0 | Compact binary MIDAS packet. Treat the bytes as opaque and version-sensitive. |
| `dfXML` | 1 | XML packet whose extended characters use escape sequences rather than UTF-8 bytes. |
| `dfXMLUTF8` | 2 | XML packet with extended characters represented in UTF-8. |

#### Behavior and boundaries

- Changing the format changes the on-disk/on-stream representation, not the logical rows. A consumer must support the selected MIDAS packet form.
- `dfXMLUTF8` is the portable text choice when the receiving product supports it; do not infer UTF-8 from a `.xml` extension alone.
- `SaveToFile` creates or truncates its destination. `SaveToStream` starts at the caller-owned stream's current position and does not rewind or truncate it.
- Do not persist `Ord(Format)` as a business contract. Persist an explicit name such as `dfXMLUTF8` and map it deliberately.

### Additional Technical Info
`TDataPacketFormat` is passed to client-dataset save operations. It controls the representation of the complete MIDAS data packet, including data and dataset metadata; it is not a choice of ordinary delimited-file format.

The script importer registers the same three values and ordering as the current Delphi `Datasnap.DBClient` source. `TvxClientDataSet.SaveToFile` and `SaveToStream` require the format argument even though some native Delphi overloads provide a default.

**Related Code Library entries**

- [TvxClientDataSet.SaveToFile](../../Classes/Data/TvxClientDataSet/Methods/SaveToFile.md) - file replacement and required script arguments.
- [TvxClientDataSet.SaveToStream](../../Classes/Data/TvxClientDataSet/Methods/SaveToStream.md) - stream position, ownership and packet behavior.

**External references**

- [Embarcadero TDataPacketFormat](https://docwiki.embarcadero.com/Libraries/en/Datasnap.DBClient.TDataPacketFormat) - Delphi packet-format meanings.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal and enumeration semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration and ordinal concepts.

<small>Created 2026-07-15</small>
