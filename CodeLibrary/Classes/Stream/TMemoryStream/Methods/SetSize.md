---
title: SetSize
description: Reallocates the memory stream to a 32-bit script-supplied byte length, preserving existing bytes and clamping an out-of-range cursor.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, memory, resize, capacity, position]
---

```Delphi
procedure SetSize(NewSize: LongInt);
```

### Example

```Delphi
procedure PrepareFixedBuffer(Buffer: TMemoryStream; ByteCount: LongInt);
begin
  if Buffer = nil then Exit;
  if ByteCount < 0 then Exit;

  Buffer.SetSize(ByteCount);
  Buffer.Position := 0;
end;
```

### Usage

`SetSize` reallocates the memory stream to a 32-bit script-supplied byte length, preserving existing bytes and clamping an out-of-range cursor.

### Additional Technical Info
`SetSize` changes the logical byte length and reallocates the backing capacity. Velox exposes the 32-bit `LongInt` overload even though the native class also has Int64 support. Keep `NewSize` nonnegative and within practical process-memory limits.

Existing bytes up to `min(old Size, NewSize)` are preserved. Shrinking discards the tail. Growing preserves the old prefix but does not promise that newly exposed bytes are zero-filled; write every byte that will be consumed or emitted.

The old Position is preserved when it is at or before the new end. If it lies past a smaller NewSize, the implementation seeks to the new end. Set Position explicitly when the resize is part of a new read/write phase.

An allocation failure raises and may occur after size/capacity work has begun inside the memory manager. Do not request a size directly from untrusted metadata without a maximum. This method is not a reservation-only API: Size immediately becomes NewSize, so unwritten grown bytes are part of the logical stream.

The inherited [`Size`](../../TStream/Properties/Size.md) setter reaches the same native resize path through a 32-bit PascalScript helper. Clear differs by explicitly releasing capacity and setting Position/Size to zero.

The example is source-reviewed only; no buffer was allocated.

**External references**

- [Embarcadero: `TMemoryStream.SetSize`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream.SetSize) - native overloads and preservation behavior.
- [Free Pascal: `TMemoryStream.SetSize`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.setsize.html) - compatible sizing and cursor correction.

<small>Created 2026-07-15</small>
