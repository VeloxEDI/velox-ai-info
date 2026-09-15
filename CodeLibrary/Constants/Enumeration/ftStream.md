---
title: ftStream
description: Identifies a live TStream object parameter whose ownership, current position and read/write capabilities are API-defined.
sidebar_position: 125
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, stream, parameter, ownership, position]
---

```Delphi
ftStream = 48
```

### Example

```Delphi
function IsStreamParameter(DataType: TFieldType): Boolean;
begin
  Result := DataType = ftStream;
end;
```

### Usage

`ftStream` identifies a live TStream object parameter whose ownership, current position and read/write capabilities are API-defined.

### Additional Technical Info
`ftStream` is ordinal 48 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It marks a `TStream` object parameter and has no default ordinary field class.

The enum does not say whether the stream is readable, writable, seekable, memory-backed or file-backed. The current `Position` is part of the call contract: a consumer may read from it, reset it or leave it at end. Ownership is separate; never free or retain a caller-owned stream without explicit permission.

Bound reads/copies for untrusted or very large streams, propagate errors, and avoid assuming `Size` is available. Streams are generally mutable and not inherently thread-safe.

The example only compares metadata and was source-reviewed; no stream, file, object, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TStream`](https://docwiki.embarcadero.com/Libraries/en/System.Classes.TStream).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) compatibility references.

<small>Created 2026-07-15</small>
