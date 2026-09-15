---
title: Read
description: Reads up to Count raw bytes into preallocated String backing memory and reports short reads or EOF without raising for incompleteness.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, read, string-buffer, bytes, eof]
---

```Delphi
function Read(Buffer: string; Count: LongInt): LongInt;
```

### Example

```Delphi
procedure ReadChunk(Stream: TStream);
var
  Buffer: String;
  BytesRead: LongInt;
begin
  if Stream = nil then Exit;

  SetLength(Buffer, 4096); // Allocate before the native raw-buffer call.
  BytesRead := Stream.Read(Buffer, 4096);
  Log('Bytes read: ' + IntToStr(BytesRead));
end;
```

### Usage

Reads up to `Count` raw bytes into a preallocated `String` variable and returns the number actually read. A short read or end of stream is reported by the returned count rather than raised as an error.

### Additional Technical Info
`Read` attempts to transfer up to `Count` bytes from the current stream cursor into the backing memory of `Buffer`. It returns the actual byte count, advances [`Position`](../Properties/Position.md) by that amount, and commonly returns `0` at end-of-stream.

#### Critical String-buffer adapter

Native Delphi declares an untyped `var Buffer`; the Velox PascalScript importer substitutes `string`. This remains raw byte I/O:

- Count is bytes, not characters.
- Read does not call SetLength or decode text.
- Buffer must be a writable variable with enough allocated backing memory before the call.
- Only the first returned byte count is valid; the rest retains its previous allocation content.
- Embedded zero and invalid text code units are possible, so ordinary String operations are not reliable binary processing.

Allocating at least Count String characters, as in the example, provides at least Count backing bytes on the current Unicode host, but it does not turn the bytes into text. Use the Code Library's encoding-specific stream conversion functions when text is the goal.

Read is the partial-count API. It does not raise merely because fewer than Count bytes remain. Use [`ReadBuffer`](ReadBuffer.md) when the protocol requires an exact fixed byte count. A descendant can still raise for invalid access, I/O errors, a negative count or an unusable buffer.

The receiving stream is borrowed and not freed. Concurrent reads/writes on the same cursor are unsafe. On an exception, some bytes and cursor movement may already have occurred depending on the descendant.

The example is source-reviewed only; it does not inspect the raw buffer and no stream was read.

**External references**

- [Embarcadero: `TStream.Read`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Read) - native partial-read contract.
- [Free Pascal: `TStream.Read`](https://www.freepascal.org/docs-html/rtl/classes/tstream.read.html) - compatible byte-read behavior.

<small>Created 2026-07-15</small>
