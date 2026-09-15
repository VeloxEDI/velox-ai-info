---
title: Clear
description: Releases the memory allocation and resets the stream's logical Size and Position to zero while keeping the object reusable.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, memory, clear, size, position]
---

```Delphi
procedure Clear;
```

### Example

```Delphi
procedure ReuseBuffer(Buffer: TMemoryStream);
begin
  if Buffer = nil then Exit;

  Buffer.Clear;
  // Buffer.Size = 0 and Buffer.Position = 0.
end;
```

### Usage

`Clear` releases the memory allocation and resets the stream's logical Size and Position to zero while keeping the object reusable.

### Additional Technical Info
`Clear` discards all bytes, releases the allocated capacity, and sets both [`Size`](../../TStream/Properties/Size.md) and [`Position`](../../TStream/Properties/Position.md) to `0`. The stream object remains valid and can grow again on a later write or SetSize call.

Any prior content becomes unavailable immediately. Clear is not a secure-memory erasure guarantee: the RTL releases/reallocates memory but does not promise that every byte is overwritten before the allocator can reuse it. Do not use this method alone as a secret-destruction control.

Clear affects only this memory stream. It does not free the stream object, other streams previously copied from/to it, or consumers holding the same reference. Those consumers observe the cleared state.

No I/O occurs and no cursor state is retained. Use Position assignment instead when the intention is only to reread existing bytes. Use SetSize(0) when capacity-retention behavior matters; current Clear explicitly sets capacity to zero whereas allocation strategy remains an implementation detail for resizing.

The example is source-reviewed only; no buffer was cleared.

**External references**

- [Embarcadero: `TMemoryStream.Clear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream.Clear) - exact memory, Size and Position effects.
- [Free Pascal: `TMemoryStream.Clear`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.clear.html) - compatible clearing behavior.

<small>Created 2026-07-15</small>
