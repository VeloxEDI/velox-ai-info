---
title: Write
description: Writes up to Count raw bytes from String backing memory and reports the actual partial count without text encoding or truncation guarantees.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, write, string-buffer, bytes, partial-write]
---

```Delphi
function Write(Buffer: string; Count: LongInt): LongInt;
```

### Example

```Delphi
procedure WritePreparedBytes(Stream: TStream; RawBuffer: String; ByteCount: LongInt);
var
  BytesWritten: LongInt;
begin
  if (Stream = nil) or (ByteCount < 0) then Exit;

  // RawBuffer must already contain at least ByteCount backing bytes.
  BytesWritten := Stream.Write(RawBuffer, ByteCount);
  Log('Bytes written: ' + IntToStr(BytesWritten));
end;
```

### Usage

Writes up to `Count` raw bytes from a `String` variable and returns the number actually written. It performs no text encoding and a short write is possible, so compare the result with `Count` when completeness matters.

### Additional Technical Info
`Write` attempts to transfer up to `Count` bytes from Buffer's backing memory to the stream at its current cursor. It returns the actual byte count and advances [`Position`](../Properties/Position.md) by that amount.

Native Delphi accepts an untyped buffer; Velox substitutes PascalScript `string`. No text encoding occurs, and Count is bytes rather than characters. The caller must know how RawBuffer was produced and must not request more bytes than its allocated backing storage contains. On the current Unicode host, `Length(Buffer)` counts UTF-16 characters and is not generally the number of desired encoded output bytes.

For example, writing `Length('ABC')` bytes from a Unicode String does not produce a portable three-byte ASCII/UTF-8 representation. Use StringToStreamUTF8/ANSI/UTF16 conversion functions when a defined text encoding is required. Use CopyFrom when moving bytes already held by another stream.

Write is the partial-count API: a writable descendant can return less than Count. Use [`WriteBuffer`](WriteBuffer.md) when the complete fixed byte sequence is mandatory. Either method writes in place at Position. It does not truncate trailing content automatically; set Size explicitly or create/truncate the destination when replacement semantics are required.

The operation is immediate and nontransactional. An exception or short write can leave partial output and an advanced cursor. Validate ByteCount, destination authority/capacity and retry policy before calling.

The example is source-reviewed only; no bytes were written.

**External references**

- [Embarcadero: `TStream.Write`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Write) - native partial-write contract.
- [Free Pascal: `TStream.Write`](https://www.freepascal.org/docs-html/rtl/classes/tstream.write.html) - compatible byte-write behavior.

<small>Created 2026-07-15</small>
