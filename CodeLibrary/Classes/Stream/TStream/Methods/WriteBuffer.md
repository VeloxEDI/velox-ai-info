---
title: WriteBuffer
description: Repeats raw writes until Count String-backed bytes are stored or raises after any partial destination mutation already performed.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, write-buffer, exact-write, string-buffer, exception]
---

```Delphi
procedure WriteBuffer(Buffer: string; Count: LongInt);
```

### Example

```Delphi
procedure WritePreparedBlock(Stream: TStream; RawBuffer: String; ByteCount: LongInt);
begin
  if (Stream = nil) or (ByteCount < 0) then Exit;

  // RawBuffer must already contain at least ByteCount backing bytes.
  Stream.WriteBuffer(RawBuffer, ByteCount);
end;
```

### Usage

`WriteBuffer` repeats raw writes until Count String-backed bytes are stored or raises after any partial destination mutation already performed.

### Additional Technical Info
`WriteBuffer` writes exactly `Count` bytes from Buffer's backing memory. It calls Write and retries while positive progress is made. If the descendant returns zero/negative before completion, it raises `EWriteError`.

The Velox signature adapts Delphi's untyped buffer to `string`; it does not encode text. Count is bytes and Buffer is not validated or resized. Ensure the variable already owns at least Count backing bytes and that those bytes are in the required external encoding/format. `Length(Buffer)` is a Unicode character count on the current host, not a universal encoded byte count.

Exact-count refers to success only. Failure is not atomic: earlier iterations remain written and [`Position`](../Properties/Position.md) remains advanced. File content, memory Size or remote/custom stream state may already be partially changed. There is no rollback, flush or truncation step.

Use [`Write`](Write.md) when the caller can handle partial progress. Use CopyFrom for stream sources and encoding-specific conversion functions for text. `Count = 0` performs no meaningful transfer; negative counts are invalid.

The method cannot make a read-only stream writable and cannot guarantee persistence beyond the concrete descendant's buffering/flush semantics.

The example is source-reviewed only; no bytes were written.

**External references**

- [Embarcadero: `TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - exact-write loop and EWriteError behavior.
- [Free Pascal: `TStream.WriteBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.writebuffer.html) - compatible exact-write operation.

<small>Created 2026-07-15</small>
