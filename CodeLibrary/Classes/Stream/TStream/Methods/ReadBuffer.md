---
title: ReadBuffer
description: Repeats raw reads until Count bytes fill a preallocated String buffer or raises after any partial transfer already performed.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, read-buffer, exact-read, string-buffer, exception]
---

```Delphi
procedure ReadBuffer(Buffer: string; Count: LongInt);
```

### Example

```Delphi
procedure ReadFixedHeader(Stream: TStream; HeaderBytes: LongInt);
var
  Buffer: String;
begin
  if (Stream = nil) or (HeaderBytes < 0) then Exit;

  SetLength(Buffer, HeaderBytes);
  Stream.ReadBuffer(Buffer, HeaderBytes);
end;
```

### Usage

`ReadBuffer` repeats raw reads until Count bytes fill a preallocated String buffer or raises after any partial transfer already performed.

### Additional Technical Info
`ReadBuffer` reads exactly `Count` bytes into the backing memory of `Buffer`. It calls Read, repeats while progress is positive, and raises `EReadError` if the stream reaches EOF or stops making progress before the count is satisfied.

The Velox signature is a PascalScript adaptation of Delphi's untyped `var Buffer`. Buffer is not resized and Count is not a character length. The caller must pass a writable String variable whose allocated backing storage is at least Count bytes. An empty/short/temporary expression with positive Count can expose invalid memory to native code. Preallocate a variable with SetLength and keep Count within that allocation.

ReadBuffer is appropriate for fixed-width binary protocol sections only when the String-as-byte-buffer limitations are understood. It performs no encoding, endian conversion or validation of received bytes.

Failure is not atomic. Earlier iterations can already have overwritten the prefix of Buffer and advanced stream [`Position`](../Properties/Position.md). Catching EReadError does not restore either state. Treat the incomplete buffer as invalid and explicitly reposition only when the concrete stream supports a safe retry.

Use [`Read`](Read.md) for optional/streaming data where a short read is normal. `Count = 0` performs no meaningful transfer; negative values are invalid input.

The example is source-reviewed only; no buffer was read.

**External references**

- [Embarcadero: `TStream.ReadBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.ReadBuffer) - exact-read loop and EReadError behavior.
- [Free Pascal: `TStream.ReadBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.readbuffer.html) - compatible exact-read operation.

<small>Created 2026-07-15</small>
