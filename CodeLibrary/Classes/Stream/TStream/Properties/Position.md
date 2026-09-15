---
title: Position
description: Gets or seeks the current byte cursor through a 32-bit PascalScript helper even though the native stream cursor is 64-bit.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, position, cursor, longint, int64]
---

```Delphi
property Position: LongInt read write;
```

### Example

```Delphi
procedure RewindForRead(Stream: TStream);
begin
  if Stream = nil then Exit;

  Stream.Position := 0;
end;
```

### Usage

`Position` gets or seeks the current byte cursor through a 32-bit Velox scripting helper even though the Velox stream cursor is 64-bit.

### Additional Technical Info
`Position` is the zero-based byte offset used by the next Read or Write. Reading it calls native `Seek(0, current)`; assigning it calls `Seek(value, beginning)`.

Velox registers the property as signed 32-bit `LongInt`, while Delphi's native property is Int64. The runtime helper reads/writes through a LongInt variable. For positions outside roughly ±2 GiB, property access can truncate or raise depending on runtime checks. [`Seek`](../Methods/Seek.md) accepts/returns Int64 and is the safer method for a large offset, but code must avoid reading the narrowed property afterward.

Read, Write and CopyFrom advance Position by transferred bytes. Load/clear/resize methods have their own cursor rules; in particular, TMemoryStream.LoadFromStream can preserve an old destination Position. Set Position explicitly at phase boundaries rather than assuming zero.

Support is descendant-specific. Seekable file/memory streams accept normal nonnegative positions. A forward-only stream can reject reads or writes of Position. Setting beyond Size may be allowed without growing until a write; gaps and errors then depend on the descendant.

One stream has one shared cursor. Concurrent consumers or helper functions can change it unexpectedly. Save and restore only when the stream is seekable and both operations can be handled safely.

The example is source-reviewed only; no stream was rewound.

**External references**

- [Embarcadero: `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position) - native Int64 cursor property.
- [Free Pascal: `TStream.Position`](https://www.freepascal.org/docs-html/rtl/classes/tstream.position.html) - compatible cursor semantics.

<small>Created 2026-07-15</small>
