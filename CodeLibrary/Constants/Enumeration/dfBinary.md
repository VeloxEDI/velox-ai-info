---
title: dfBinary
description: "Selects the compact opaque binary MIDAS representation when saving a complete client-dataset packet."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, packet, binary, midas]
---

```Delphi
dfBinary = 0
```

### Example

```Delphi
procedure SaveBinaryPacket(const FileName: String);
begin
  DATA1.SaveToFile(FileName, dfBinary);
end;
```

### Usage

`dfBinary` selects the compact opaque binary MIDAS representation when saving a complete client-dataset packet.

### Additional Technical Info
`dfBinary` is ordinal 0 of [`TDataPacketFormat`](../../Types/Enumerations/TDataPacketFormat.md). Current `TCustomClientDataSet.SaveDataPacket` maps it to MIDAS `xmlOFF`, producing the compact binary representation of the complete data packet and metadata.

The bytes are not ordinary rows, CSV or a documented cross-product schema. Treat them as opaque and require a compatible MIDAS/client-dataset consumer. A filename extension does not change the format selected by this explicit argument.

[`SaveToFile`](../../Classes/Data/TvxClientDataSet/Methods/SaveToFile.md) can create or truncate the destination and runs with the Velox process account's filesystem authority. [`SaveToStream`](../../Classes/Data/TvxClientDataSet/Methods/SaveToStream.md) writes at the caller-owned stream's current position and does not rewind/truncate it. Both can allocate/serialize the complete dataset and raise after partial external effects.

Persist the name `dfBinary`, not ordinal 0, if configuration must record the choice. The example is source-reviewed only; no packet/file was written.

**External references**

- [Embarcadero TDataPacketFormat](https://docwiki.embarcadero.com/Libraries/en/Datasnap.DBClient.TDataPacketFormat) - packet mode definitions.
- [Free Pascal BufDataset](https://www.freepascal.org/docs-html/fcl/fcl-db/tbufdataset.html) - compatible in-memory dataset context only; MIDAS binary is Delphi-specific.

<small>Created 2026-07-15</small>
