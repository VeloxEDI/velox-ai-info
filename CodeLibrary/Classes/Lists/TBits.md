---
title: TBits
description: Stores a caller-owned, dynamically sized and word-packed array of Boolean flags addressed by zero-based index.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, lists, bits, boolean, flags]
---

```Delphi
TBits = class(TObject)
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Flags: TBits;
begin
  Flags := TBits.Create;
  try
    Flags.Size := 8;
    Flags.Bits[2] := True;
    Flags.Bits[5] := True;
    Value := Flags.OpenBit;  // 0
  finally
    Flags.Free;
  end;
end;
```

### Usage

`TBits` stores a caller-owned, dynamically sized and word-packed array of Boolean flags addressed by zero-based index.

### Additional Technical Info
`TBits` stores zero-based Boolean flags in packed machine words. It is useful for presence masks, allocation slots and other temporary state where an ordinary byte-sized Boolean array would use more memory. Velox registers the native Delphi class directly and exposes [`OpenBit`](TBits/Methods/OpenBit.md), indexed [`Bits`](TBits/Properties/Bits.md) and [`Size`](TBits/Properties/Size.md).

The class has no native constructor of its own. PascalScript inherits the registered parameterless `TObject.Create`, so `TBits.Create` returns a valid empty instance with `Size=0` and no allocation. A script-created instance is caller-owned and must be freed in `finally`; assigning it to another variable does not transfer ownership.

`Size` is the logical number of addressable bits, not allocated bytes. On the Windows runtime used by Velox, storage is rounded to 32-bit `Integer` words. New words are zero-filled. Expanding within an already allocated word changes only the logical bound, so bits hidden by an earlier shrink can become visible again when the size is restored. Set those newly re-exposed positions explicitly when stale true values would be unsafe.

Reads require `0 <= Index < Size` and raise `EBitsError` otherwise. Writes reject negative indexes but automatically extend the logical size to `Index + 1`; this occurs even when assigning `False`. A sparse high-index write can therefore allocate a large intermediate region.

`OpenBit` scans for the first false bit and returns its index. It neither changes the bit nor grows the set. When all logical positions are true it returns `Size`, so callers must test `Result < Size` before using it as an existing position. An empty instance consequently returns `0` while still having no readable bit.

Operations are mutable and unsynchronised. Individual reads and writes are constant-time; resizing is proportional to allocated bytes, and `OpenBit` is linear in the number of scanned words. Allocation failure propagates. Do not share one instance between concurrent scripts without external synchronization.

The source-reviewed example creates, uses and frees the set. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TBits`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TBits) - Delphi class reference used by Velox.
- [Free Pascal: `TBits`](https://www.freepascal.org/docs-html/rtl/classes/tbits.html) - compatible overview; member pages identify differences from the Delphi implementation.

<small>Created 2026-07-15</small>
